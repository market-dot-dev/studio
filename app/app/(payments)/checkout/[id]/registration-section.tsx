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
import useCurrentSession from "@/app/contexts/current-user-context";

import { onClickSubscribe } from '@/app/services/StripeService';
import { isSubscribedByTierId } from '@/app/services/SubscriptionService';
import LoadingDots from "@/components/icons/loading-dots";
import Tier from "@/app/models/Tier";
import { CustomerLoginComponent } from "@/components/login/customer-login";

const checkoutCurrency = "USD";

const AlreadySubscribedCard = () => {
  return (<Card>
    <Text>You&apos;re already subscribed to this product.</Text>
  </Card>);
}

const RegistrationCheckoutSection = ({ tier }: { tier: Tier; }) => {
  const tierId = tier?.id;
  const [submittingPaymentMethod, setSubmittingPaymentMethod] = useState(false);
  const [purchaseIntent, setPurchaseIntent] = useState(false);

  const [userAttributes, setUserAttributes] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>();

  const { currentSession, refreshCurrentSession } = useCurrentSession();
  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = currentSession;

  useEffect(() => {
    if(user?.id) {
      isSubscribedByTierId(user.id, tierId).then(setIsSubscribed);
    }
  }, [user?.id, tierId]);

  const onSubmit = async () => {
    setError(null);
    setPurchaseIntent(true);

    if(user && !user.stripePaymentMethodId) {
      setSubmittingPaymentMethod(true);
    }
  }

  useEffect(() => {
    if (purchaseIntent && !submittingPaymentMethod && user && user.stripePaymentMethodId) {
      onClickSubscribe(user.id, tierId).then((res) => {
        setPurchaseIntent(false);
        window.location.href = "/success";
      }).catch((err) => {
        setError(err.message);
        setPurchaseIntent(false);
      });
    }
  }, [purchaseIntent, user?.id, user?.stripePaymentMethodId, tierId, user, submittingPaymentMethod]);

  useEffect(() => {
    if(error){
      setSubmittingPaymentMethod(false);
      setPurchaseIntent(false);
    }
  }, [error]);

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
            <UserPaymentMethodWidget
              loading={submittingPaymentMethod}
              setError={setError}
            />
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