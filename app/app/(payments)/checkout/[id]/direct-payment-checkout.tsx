"use client"; // @TODO: Can this be a server file too?

import { StripePaymentForm } from "@/app/app/(payments)/checkout/[id]/stripe-payment-form";
import { CHECKOUT_CURRENCY } from "@/app/config/checkout";
import Tier from "@/app/models/Tier";
import { onClickSubscribe } from "@/app/services/StripeService";
import { isSubscribedByTierId } from "@/app/services/SubscriptionService";
import { ContractLink } from "@/components/contracts/contract-link";
import { CustomerLoginComponent } from "@/components/login/customer-login";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type VendorProfile } from "@/types/checkout";
import { Contract } from "@prisma/client";
import { useEffect, useState } from "react";

interface RegistrationCheckoutSectionProps {
  tier: Tier;
  vendor: VendorProfile;
  contract?: Contract | null;
  annual?: boolean;
  userId?: string;
}

export function DirectPaymentCheckout({
  tier,
  vendor,
  contract,
  annual = false,
  userId
}: RegistrationCheckoutSectionProps) {
  const tierId = tier?.id;
  const checkoutPrice = annual ? tier?.priceAnnual : tier?.price;

  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // @NOTE: Wtf is this?
  useEffect(() => {
    if (error) {
      console.log("error found, bailing");
      setLoading(false);
      setSubmittingPayment(false);
    }
  }, [error]);

  // @NOTE: This seems to trigger an effect when loading state changes; submitting the payment?
  useEffect(() => {
    if (loading) {
      setError(null);
      if (!userId) {
        setError("Please register or sign in.");
      } else if (!paymentReady) {
        setSubmittingPayment(true);
      } else {
        onClickSubscribe(userId, tierId, annual)
          .then((res) => {
            setLoading(false);
            window.location.href = "/success";
          })
          .catch((err) => {
            setError(err.message);
          });
      }
    }
  }, [loading, userId, paymentReady]);

  // @NOTE: This shouldn't be here either, cause if the user changes, the page should reload.
  // @NOTE: Essentially this should be passed down by the server, not checked here.
  // when user changes, check subscription
  useEffect(() => {
    if (!!userId && !!tierId) {
      isSubscribedByTierId(userId, tierId).then(setSubscribed);
    }
  }, [userId, tierId]);

  if (subscribed) {
    return <AlreadySubscribedCard />;
  } else
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
            {vendor.stripeAccountId && (
              <StripePaymentForm
                loading={submittingPayment}
                setError={setError}
                setPaymentReady={setPaymentReady}
                maintainerUserId={tier.userId}
                maintainerStripeAccountId={vendor.stripeAccountId}
              />
            )}
            {error && <div className="mt-4 text-red-600">{error}</div>}
          </Card>
        </section>

        <section>
          {contract && (
            <div className="mb-4 text-center text-xs font-medium tracking-tightish text-stone-500">
              <ContractLink contract={contract} />
            </div>
          )}
          <Button
            loading={loading || submittingPayment}
            disabled={loading || !userId || submittingPayment}
            data-cy="checkout-button"
            className="w-full"
            size="lg"
            // @TODO: Setting loading here, but what else? Doesn't seem to do much. Pretty bad practice if this fires a useEffect.
            onClick={() => setLoading(true)}
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
              <strong className="text-stone-800">{`${CHECKOUT_CURRENCY} $${checkoutPrice}`}</strong>
              .
            </p>
          ) : null}
        </section>
      </div>
    );
}

const AlreadySubscribedCard = () => {
  return <p className="text-sm text-stone-500">You&apos;re already subscribed to this product.</p>;
};
