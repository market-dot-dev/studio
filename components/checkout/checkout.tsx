"use client";

import Tier from "@/app/models/Tier";
import { onClickSubscribe } from "@/app/services/StripeService";
import { isSubscribedByTierId } from "@/app/services/SubscriptionService";
import { StripePaymentForm } from "@/components/common/stripe-payment-form";
import { CustomerLoginComponent } from "@/components/login/customer-login";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getRootUrl } from "@/lib/domain";
import { Contract, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";

const checkoutCurrency = "USD";

interface RegistrationCheckoutSectionProps {
  tier: Tier;
  maintainer: User;
  contract?: Contract;
  annual?: boolean;
  userId?: string;
}

const ContractText = ({ contract }: { contract?: Contract }) => {
  const baseUrl = getRootUrl("app", "/c/contracts");
  const url = contract ? `${baseUrl}/${contract.id}` : `${baseUrl}/standard-msa`;

  const contractName = contract?.name || "Standard MSA";

  return (
    <>
      By clicking checkout, you agree to the terms detailed in{" "}
      <a href={url} className="underline" target="_blank">
        {contractName}
      </a>
      .
    </>
  );
};

export default function RegistrationCheckoutSection({
  tier,
  maintainer,
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

  useEffect(() => {
    if (error) {
      console.log("error found, bailing");
      setLoading(false);
      setSubmittingPayment(false);
    }
  }, [error]);

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
            {maintainer.stripeAccountId && (
              <StripePaymentForm
                loading={submittingPayment}
                setError={setError}
                setPaymentReady={setPaymentReady}
                maintainerUserId={tier.userId}
                maintainerStripeAccountId={maintainer.stripeAccountId}
              />
            )}
            {error && <div className="mt-4 text-red-600">{error}</div>}
          </Card>
        </section>

        <section>
          <div className="mb-4 text-center text-xs font-medium tracking-tightish text-stone-500">
            <ContractText contract={contract} />
          </div>
          <Button
            loading={loading || submittingPayment}
            disabled={loading || !userId || submittingPayment}
            data-cy="checkout-button"
            className="w-full"
            size="lg"
            onClick={() => setLoading(true)}
          >
            {tier.cadence === "once"
              ? `Pay $${checkoutPrice} ${checkoutCurrency}`
              : tier.trialDays && tier.trialDays !== 0
                ? "Start your free trial"
                : `Pay $${checkoutPrice} ${checkoutCurrency}`}
          </Button>
          {tier.cadence !== "once" && tier.trialDays && tier.trialDays !== 0 ? (
            <p className="mt-6 text-pretty text-center text-xs font-medium tracking-tightish text-stone-500">
              You won&apos;t be charged now. After your{" "}
              <strong className="text-stone-800">{tier.trialDays} day trial</strong>, your card will
              be charged{" "}
              <strong className="text-stone-800">{`${checkoutCurrency} $${checkoutPrice}`}</strong>.
            </p>
          ) : null}
        </section>
      </div>
    );
}

const AlreadySubscribedCard = () => {
  return <p className="text-sm text-stone-500">You&apos;re already subscribed to this product.</p>;
};
