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
import { getCustomerIds } from "@/app/models/Customer";

const checkoutCurrency = "USD";
  "Nokogiri is an HTML, XML, SAX, and Reader parser. Among Nokogiri's many features is the ability to search documents via XPath or CSS3 selectors. XML is like violence - if it doesn’t solve your problems, you are not using enough of it.";

const AlreadySubscribedCard = () => {
  return (<Card>
    <Text>You&apos;re already subscribed to this product.</Text>
  </Card>);
}

const RegistrationCheckoutSection = ({ tier, maintainer }: { tier: Tier; maintainer: User }) => {
  const tierId = tier?.id;
  const [loading, setLoading] = useState(false);
  const [submittingPaymentMethod, setSubmittingPaymentMethod] = useState(false);
  const [purchaseIntent, setPurchaseIntent] = useState(false);

  const [userAttributes, setUserAttributes] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>();

  const { currentSessionUser: user, refreshCurrentSessionUser } = useCurrentSession();
  
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [stripePaymentMethodId, setStripePaymentMethodId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if(user?.id) {
      const { stripeCustomerId, stripePaymentMethodId } = getCustomerIds(user, tier.userId);
      setStripeCustomerId(stripeCustomerId);
      setStripePaymentMethodId(stripePaymentMethodId);
      isSubscribedByTierId(user.id, tierId).then(setIsSubscribed);
    }
  }, [user?.id, tierId, tier.userId, user?.stripeCustomerIds, user?.stripePaymentMethodIds]);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    setPurchaseIntent(true);

    if(stripeCustomerId && stripePaymentMethodId) {
      setSubmittingPaymentMethod(true);
      setLoading(false);
    }
    
  }

  useEffect(() => {
    if (purchaseIntent && user && stripePaymentMethodId) {
      onClickSubscribe(user.id, tierId).then((res) => {
        setPurchaseIntent(false);
        if(res.error) {
          setError(res.error);
          setLoading(false);
        } else {
          window.location.href = "/success";
        }
      });
    }
  }, [purchaseIntent, user?.id, stripePaymentMethodId, tierId, user]);

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