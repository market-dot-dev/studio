"use client";

import { CHECKOUT_CURRENCY } from "@/app/config/checkout";
import { processPayment } from "@/app/services/checkout-service";
import { SimplePaymentElement } from "@/components/checkout/stripe-payment-element";
import { ContractLink } from "@/components/contracts/contract-link";
import { CustomerLoginComponent } from "@/components/login/customer-login";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type VendorProfile } from "@/types/checkout";
import { Contract, Tier } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DirectPaymentCheckoutProps {
  tier: Tier;
  vendor: VendorProfile;
  contract?: Contract | null;
  annual?: boolean;
  userId?: string;
  isAlreadySubscribed?: boolean;
}

type PaymentState =
  | { status: "idle" }
  | { status: "processing" }
  | { status: "error"; message: string }
  | { status: "success" };

export function DirectPaymentCheckout({
  tier,
  vendor,
  contract,
  annual = false,
  userId,
  isAlreadySubscribed = false
}: DirectPaymentCheckoutProps) {
  const router = useRouter();
  const tierId = tier.id;
  const checkoutPrice = annual ? tier.priceAnnual : tier.price;

  const [paymentState, setPaymentState] = useState<PaymentState>({ status: "idle" });
  const [paymentReady, setPaymentReady] = useState(false);

  const handleSubmit = async () => {
    if (paymentState.status === "processing") {
      return; // Prevent multiple submissions
    }

    // Check if payment method is ready
    if (!paymentReady) {
      setPaymentState({ status: "processing" });
      return;
    }

    setPaymentState({ status: "processing" });

    try {
      await processPayment(userId!, tierId, annual);
      setPaymentState({ status: "success" });
      router.replace("/success");
    } catch (err: any) {
      setPaymentState({
        status: "error",
        message: err.message || "An error occurred during payment processing."
      });
    }
  };

  if (isAlreadySubscribed) {
    return (
      <p className="text-sm text-stone-500">You&apos;re already subscribed to this product.</p>
    );
  }

  const isProcessing = paymentState.status === "processing";
  const isDisabled = isProcessing || !userId || !paymentReady || paymentState.status == "success";
  const errorMessage = paymentState.status === "error" ? paymentState.message : null;

  return (
    <div className="mx-auto flex w-full flex-col gap-9 lg:max-w-lg">
      <section>
        <h2 className="mb-6 text-2xl/6 font-bold tracking-tightish text-stone-800">Account</h2>
        <CustomerLoginComponent signup={true} />
      </section>

      <Separator />

      <section>
        <h2 className="mb-6 text-2xl/6 font-bold tracking-tightish text-stone-800">Payment</h2>
        <Card className="min-h-[60px] p-5">
          {vendor.stripeAccountId && userId && (
            <SimplePaymentElement
              userId={tier.userId}
              vendorStripeAccountId={vendor.stripeAccountId}
              setPaymentReady={setPaymentReady}
            />
          )}
          {errorMessage && <div className="mt-4 text-red-600">{errorMessage}</div>}
        </Card>
      </section>

      <section>
        {contract && (
          <div className="mb-4 text-center text-xs font-medium tracking-tightish text-stone-500">
            <ContractLink contract={contract} />
          </div>
        )}
        <Button
          loading={isProcessing}
          disabled={isDisabled}
          data-cy="checkout-button"
          className="w-full"
          size="lg"
          onClick={handleSubmit}
        >
          {tier.cadence === "once"
            ? `Pay $${checkoutPrice} ${CHECKOUT_CURRENCY}`
            : tier.trialDays && tier.trialDays !== 0
              ? "Start your free trial"
              : `Pay $${checkoutPrice} ${CHECKOUT_CURRENCY}`}
        </Button>
        {tier.cadence !== "once" && tier.trialDays && tier.trialDays !== 0 ? (
          <p className="mt-6 text-pretty text-center text-xs font-medium tracking-tightish text-stone-500">
            You won&apos;t be charged now. After your{" "}
            <strong className="text-stone-800">{tier.trialDays} day trial</strong>, your card will
            be charged{" "}
            <strong className="text-stone-800">{`${CHECKOUT_CURRENCY} $${checkoutPrice}`}</strong>.
          </p>
        ) : null}
      </section>
    </div>
  );
}
