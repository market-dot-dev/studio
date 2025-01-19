"use client";

import { Card, Text, Button } from "@tremor/react";
import UserPaymentMethodWidget from "@/components/common/user-payment-method-widget";
import { useEffect, useState } from "react";
import { User, Contract } from "@prisma/client";

import { onClickSubscribe } from "@/app/services/StripeService";
import { isSubscribedByTierId } from "@/app/services/SubscriptionService";
import LoadingDots from "@/components/icons/loading-dots";
import Tier from "@/app/models/Tier";
import { CustomerLoginComponent } from "@/components/login/customer-login";
import SectionHeader from "./section-header";
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
    : `${baseUrl}/gitwallet-msa`;

  const contractName = contract?.name || "Standard Gitwallet MSA";

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

  const tierInfo = tier?.name || "Package";

  if (subscribed) {
    return <AlreadySubscribedCard />;
  } else
    return (
      <>
        <section className="w-7/8 text-md mb-8 text-slate-600 lg:w-5/6">
          <SectionHeader headerName={"Purchase " + tierInfo} />
          <span>
            To purchase this package, please provide your account & payment
            information below.
          </span>
        </section>

        <section className="w-7/8 text-md mb-8 text-slate-600 lg:w-5/6">
          <SectionHeader headerName="Your Account" />
          <Card>
            <CustomerLoginComponent signup={true} />
          </Card>
        </section>

        <section className="w-7/8 mb-8 lg:w-5/6">
          <SectionHeader headerName="Payment Information" />
          <Card>
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

        <section className="w-7/8 mb-8 lg:w-5/6">
          <Text className="my-2 text-center">
            <ContractText contract={contract} />
          </Text>
          <Button
            onClick={() => setLoading(true)}
            disabled={loading || !userId}
            color="green"
            className="w-full"
            data-cy="checkout-button"
          >
            {loading ? <LoadingDots color="#A8A29E" /> : "Checkout"}
          </Button>
          <Text className="my-2 text-center">
            {tier.trialDays
              ? "You will not be charged now. After your " +
                tier.trialDays +
                " day trial, your card will be charged " +
                checkoutCurrency +
                " " +
                checkoutPrice +
                "."
              : "Your card will be charged " +
                checkoutCurrency +
                " " +
                checkoutPrice +
                "."}
          </Text>
        </section>
      </>
    );
}

const AlreadySubscribedCard = () => {
  return (
    <Card>
      <Text>You&apos;re already subscribed to this product.</Text>
    </Card>
  );
};
