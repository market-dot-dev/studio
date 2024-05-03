"use client";

import {
  Card,
  Divider,
  Text,
  Button,
} from "@tremor/react";
import UserPaymentMethodWidget from "@/components/common/user-payment-method-widget";
import UserAchWidget from "@/components/payments/user-ach-widget";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";

import { onClickSubscribe } from '@/app/services/StripeService';
import { isSubscribedByTierId } from '@/app/services/SubscriptionService';
import LoadingDots from "@/components/icons/loading-dots";
import Tier from "@/app/models/Tier";
import { CustomerLoginComponent } from "@/components/login/customer-login";
import useCurrentSession from "@/app/hooks/use-current-session";

const checkoutCurrency = "USD";

const AlreadySubscribedCard = () => {
  return (<Card>
    <Text>You&apos;re already subscribed to this product.</Text>
  </Card>);
}

const RegistrationCheckoutSection = ({ tier, maintainer, annual = false }: {
  tier: Tier;
  maintainer: User;
  annual?: boolean;
}) => {
  const { currentUser: user, refreshSession } = useCurrentSession();
  const userId = user?.id;
  const tierId = tier?.id;
  const checkoutPrice = annual ? tier?.priceAnnual : tier?.price;
  
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [submittingSubscription, setSubmittingSubscription] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [useBankAccount, setUseBankAccount] = useState(false);

  useEffect(() => {
    if(error){
      console.log("error found, bailing");
      setLoading(false);
      setSubmittingPayment(false);
      setSubmittingSubscription(false);
    }
  }, [error]);

  useEffect(() => {
    if(loading){
      setError(null);
      if(!userId){
        setError("Please register or sign in.");
      } else if(!paymentReady){
        setSubmittingPayment(true);
      } else {
        setSubmittingSubscription(true);
        onClickSubscribe(userId, tierId, annual).then((res) => {
          setLoading(false);
          window.location.href = "/success";
        }).catch((err) => {
          setError(err.message);
          throw err;
        });
      }
    }
  }, [loading, userId, paymentReady]);

  // when user changes, check subscription
  useEffect(() => {
    if(!!userId && !!tierId){
      isSubscribedByTierId(userId, tierId).then(setSubscribed);
    }
  }, [userId, tierId]);

  if(subscribed) {
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
            { !maintainer.stripeAccountId  && <>
              <div>This maintainer&apos;s account is not ready to receive payments yet. Contact the maintainer or try again later.</div>
            </> }

            { maintainer.stripeAccountId && (
              useBankAccount ?
              <>
                <UserAchWidget
                  paymentReady={paymentReady}
                  setError={setError}
                  setPaymentReady={setPaymentReady}
                  maintainerUserId={tier.userId}
                  maintainerStripeAccountId={maintainer.stripeAccountId} 
                />
              </> : 
              <UserPaymentMethodWidget
                loading={submittingPayment}
                setError={setError}
                setPaymentReady={setPaymentReady}
                maintainerUserId={tier.userId}
                maintainerStripeAccountId={maintainer.stripeAccountId}
              /> 
            ) }
            
            { !paymentReady && <div onClick={() => setUseBankAccount(!useBankAccount)}>Pay with { useBankAccount ? 'card' : 'bank account' }</div> }
          </div>
      </section>

      <section className="w-7/8 mb-8 lg:w-5/6">
        <Button onClick={() => setLoading(true)} disabled={loading} className="w-full">
          {loading ? <LoadingDots color="#A8A29E" /> : "Checkout"}
        </Button>
        <label className="my-2 block text-center text-sm text-slate-400">
          Your card will be charged {checkoutCurrency} {checkoutPrice}
        </label>
      </section>
    </>
  );
};

export default RegistrationCheckoutSection;