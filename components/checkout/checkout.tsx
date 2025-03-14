"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import UserPaymentMethodWidget from "@/components/common/user-payment-method-widget";
import { useEffect, useState } from "react";
import { User, Contract } from "@prisma/client";
import { onClickSubscribe } from "@/app/services/StripeService";
import { isSubscribedByTierId } from "@/app/services/SubscriptionService";
import Tier from "@/app/models/Tier";
import { CustomerLoginComponent } from "@/components/login/customer-login";
import { getRootUrl } from "@/lib/domain";

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
  const url = contract
    ? `${baseUrl}/${contract.id}`
    : `${baseUrl}/standard-msa`;

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
  userId,
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
      <div className="mx-auto flex flex-col gap-12 lg:max-w-lg lg:gap-16">
        <section>
          <h2 className="mb-6 border-b pb-2 text-2xl font-bold tracking-tight text-stone-800">
            Account
          </h2>
          <CustomerLoginComponent signup={true} />
        </section>

        <section>
          <h2 className="mb-6 border-b pb-2 text-2xl font-bold text-stone-800">
            Payment
          </h2>
          <Card className="px-4 py-2">
            {error && <div className="mb-4 text-red-500">{error}</div>}
            {maintainer.stripeAccountId && (
              <UserPaymentMethodWidget
                loading={submittingPayment}
                setError={setError}
                setPaymentReady={setPaymentReady}
                maintainerUserId={tier.userId}
                maintainerStripeAccountId={maintainer.stripeAccountId}
              />
            )}
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
            {tier.trialDays && tier.trialDays !== 0
              ? "Start your free trial"
              : `Pay $${checkoutPrice} ${checkoutCurrency}`}
          </Button>
          {tier.trialDays && tier.trialDays !== 0 ? (
            <p className="mt-6 text-pretty text-center text-xs font-medium tracking-tightish text-stone-500">
              You won't be charged now. After your{" "}
              <strong>{tier.trialDays} day</strong> trial, your card will be
              charged{" "}
              <strong className="tracking-tight text-stone-800">{`${checkoutCurrency} $${checkoutPrice}`}</strong>
              .
            </p>
          ) : null}
        </section>
      </div>
    );
}

const AlreadySubscribedCard = () => {
  return (
    <Card>
      <p className="text-sm text-stone-500">You&apos;re already subscribed to this product.</p>
    </Card>
  );
};
