"use client";

import {
  Card,
  Divider,
  Text,
  Button,
} from "@tremor/react";
import UserPaymentMethodWidget from "@/components/common/user-payment-method-widget";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";

import { onClickSubscribe } from '@/app/services/StripeService';
import { isSubscribedByTierId } from '@/app/services/SubscriptionService';
import LoadingDots from "@/components/icons/loading-dots";
import Tier from "@/app/models/Tier";
import { CustomerLoginComponent } from "@/components/login/customer-login";
import { getCustomerIds } from "@/app/models/Customer";
import useCurrentSession from "@/app/hooks/use-current-session";

const checkoutCurrency = "USD";

const AlreadySubscribedCard = () => {
  return (<Card>
    <Text>You&apos;re already subscribed to this product.</Text>
  </Card>);
}

const RegistrationCheckoutSection = ({ tier, maintainer }: { tier: Tier; maintainer: User }) => {
  const { currentUser: user, refreshSession } = useCurrentSession();
  
  const tierId = tier?.id;
  const [submittingPaymentMethod, setSubmittingPaymentMethod] = useState(false);
  const [purchaseIntent, setPurchaseIntent] = useState(false);

  const [error, setError] = useState<string | null>();
  
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [stripePaymentMethodId, setStripePaymentMethodId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if(!!user) {
      const { stripeCustomerId, stripePaymentMethodId } = getCustomerIds(user, maintainer.stripeAccountId!);
      setStripeCustomerId(stripeCustomerId);
      setStripePaymentMethodId(stripePaymentMethodId);
      isSubscribedByTierId(user.id, tierId).then(setIsSubscribed);
    }
  }, [user, tierId, tier.userId, user?.stripeCustomerIds, user?.stripePaymentMethodIds, maintainer.stripeAccountId, isSubscribed]);

  const onSubmit = async () => {
    setError(null);
    setPurchaseIntent(true);

    if(!!user && !stripePaymentMethodId) {
      setSubmittingPaymentMethod(true);
    }
  }

  useEffect(() => {
    if(error){
      setSubmittingPaymentMethod(false);
      setPurchaseIntent(false);
    }
  }, [error]);

  useEffect(() => {
    if (purchaseIntent && !submittingPaymentMethod && user && stripePaymentMethodId) {
      onClickSubscribe(user.id, tierId).then((res) => {
        setPurchaseIntent(false);
        window.location.href = "/success";
      }).catch((err) => {
        setError(err.message);
        setPurchaseIntent(false);
      });
    }
  }, [purchaseIntent, user?.id, stripePaymentMethodId, tierId, user, submittingPaymentMethod]);

  if(isSubscribed) {
    return <AlreadySubscribedCard />
  } else return (
    <>
      <section className="w-7/8 mb-8 lg:w-5/6">
        <Divider className={!user?.id ? "font-bold text-lg" : ""}>Login / Signup</Divider>
        <Card>
          <CustomerLoginComponent signup={true} />
        </Card>
      </section>

      <section className="w-7/8 mb-8 lg:w-5/6">
        { error && <div className="mb-4 text-red-500">{error}</div> }
        <Divider className={user?.id ? "font-bold text-lg" : ""}>Credit Card Information</Divider>
          <div>
            { maintainer.stripeAccountId  &&
              <UserPaymentMethodWidget
                loading={submittingPaymentMethod}
                setError={setError}
                maintainerUserId={tier.userId}
                maintainerStripeAccountId={maintainer.stripeAccountId}
              /> }
          </div>
      </section>

      <section className="w-7/8 mb-8 lg:w-5/6">
        <Button onClick={onSubmit} disabled={purchaseIntent || !user?.id} className="w-full">
          {purchaseIntent ? <LoadingDots color="#A8A29E" /> : "Checkout"}
        </Button>
        <label className="my-2 block text-center text-sm text-slate-400">
          Your card will be charged {checkoutCurrency + " " + tier?.price}
        </label>
      </section>
    </>
  );
};

export default RegistrationCheckoutSection;