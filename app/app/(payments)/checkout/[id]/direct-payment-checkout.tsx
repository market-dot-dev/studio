"use client";

import { CHECKOUT_CURRENCY } from "@/app/config/checkout";
import { processPayment } from "@/app/services/checkout-service";
import { SimplePaymentElement } from "@/components/checkout/stripe-payment-element";
import { ContractLink } from "@/components/contracts/contract-link";
import { CustomerLoginComponent } from "@/components/login/customer-login";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type VendorProfile } from "@/types/checkout";
import { Contract, Tier } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StepNumber } from "./step-number";

interface DirectPaymentCheckoutProps {
  tier: Tier;
  vendor: VendorProfile;
  contract?: Contract | null;
  annual?: boolean;
  userId?: string;
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
  userId
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

  const isProcessing = paymentState.status === "processing";
  const isDisabled = isProcessing || !userId || !paymentReady || paymentState.status === "success";
  const errorMessage = paymentState.status === "error" ? paymentState.message : null;

  return (
    <div className="mx-auto flex w-full flex-col gap-12 md:max-w-xl lg:max-w-md xl:max-w-lg">
      <section className="relative ">
        <div className="absolute -bottom-10 left-0 top-0 hidden flex-col items-center gap-2 md:left-[-60px] md:flex">
          <StepNumber number={1} />
          <span className="h-full border-l" />
        </div>
        <div className="w-full">
          <h2 className="mb-6 flex items-center gap-4 text-2xl/6 font-bold tracking-tightish text-stone-800">
            <StepNumber number={1} className="md:hidden" />
            Account
          </h2>
          <CustomerLoginComponent signup={true} />
        </div>
      </section>

      <section className="relative">
        <div className="absolute -bottom-10 left-0 top-0 hidden flex-col items-center gap-2 md:left-[-60px] md:flex">
          <StepNumber number={2} disabled={!userId} />
          <span
            className={cn(
              "h-full w-px bg-gradient-to-b from-stone-200 from-80% via-stone-200 via-80% to-transparent to-100% transition-opacity",
              !userId && "opacity-0"
            )}
          />
        </div>
        <div>
          <h2 className="mb-6 flex items-center gap-4 text-2xl/6 font-bold tracking-tightish text-stone-800 transition-opacity duration-500 ease-in-out">
            <StepNumber number={2} disabled={!userId} className="md:hidden" />
            <span className={cn(!userId && "opacity-40")}>Payment</span>
          </h2>
          <AnimatePresence>
            {userId && vendor?.stripeAccountId && (
              <motion.div
                key="payment-card"
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Card className="min-h-[60px] p-5">
                  <SimplePaymentElement
                    userId={tier.userId}
                    vendorStripeAccountId={vendor.stripeAccountId!}
                    setPaymentReady={setPaymentReady}
                  />
                  {errorMessage && <div className="mt-4 text-red-600">{errorMessage}</div>}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section>
        {contract && (
          <div className="mb-6 text-center text-xs text-stone-500">
            <ContractLink contract={contract} />
          </div>
        )}
        <Button
          size="lg"
          variant={isDisabled ? "secondary" : "default"}
          loading={isProcessing}
          disabled={isDisabled}
          data-cy="checkout-button"
          onClick={handleSubmit}
          className="w-full"
        >
          {tier.cadence === "once"
            ? `Pay $${checkoutPrice} ${CHECKOUT_CURRENCY}`
            : tier.trialDays && tier.trialDays !== 0
              ? "Start your free trial"
              : `Pay $${checkoutPrice} ${CHECKOUT_CURRENCY}`}
        </Button>
        {tier.cadence !== "once" && tier.trialDays && tier.trialDays !== 0 ? (
          <p className="mt-4 text-pretty text-center text-xs text-stone-500">
            You won&apos;t be charged now. After your{" "}
            <strong className="font-medium tracking-tightish text-stone-800">
              {tier.trialDays} day trial
            </strong>
            , you'll be charged{" "}
            <strong className="font-medium tracking-tightish text-stone-800">{`${CHECKOUT_CURRENCY} $${checkoutPrice}`}</strong>
            .
          </p>
        ) : null}
      </section>
    </div>
  );
}
