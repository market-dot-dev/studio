"use client";

import Image from "next/image";
import {
  Col,
  Grid,
  Badge,
  Card,
  Divider,
  TextInput,
  Switch,
  Button,
} from "@tremor/react";
import UserPaymentMethodWidget from "@/components/common/user-payment-method-widget";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Subscription, User } from "@prisma/client";
import useCurrentSession from "@/app/contexts/current-user-context";
import RegistrationService from "@/app/services/registration-service";
import { onClickSubscribe } from '@/app/services/StripeService';
import { findSubscription, isSubscribed } from '@/app/services/SubscriptionService';
import LoadingDots from "@/components/icons/loading-dots";

const checkoutPrice = "10";
const checkoutCurrency = "USD";
  "Nokogiri is an HTML, XML, SAX, and Reader parser. Among Nokogiri's many features is the ability to search documents via XPath or CSS3 selectors. XML is like violence - if it doesn’t solve your problems, you are not using enough of it.";

const AlreadySubscribedCard = ({ subscription }: { subscription: Subscription }) => {
  return (<Card>
    <p>You&apos;re already subscribed to this product.</p>
  </Card>);
}

interface RegistrationFormProps {
  user?: User;
  userAttributes: Partial<User>;
  setUserAttributes: Dispatch<SetStateAction<Partial<User>>>;
}

const RegistrationForm = ({ user, userAttributes, setUserAttributes }: RegistrationFormProps) => {

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedUser = { ...userAttributes, [name]: value } as User;
    setUserAttributes(updatedUser);
  };

  return <>
    <Card>
      { user && <>
        <p>You&apos;re logged in as {user.email}</p>
        <Button onClick={() => {}} className="w-full">Logout</Button>
      </> }
      { !user && <>
        <div className="items-center mb-4">
          <TextInput 
            name="name"
            onChange={handleInputChange}
            placeholder="Name" 
          />
        </div>
        <div className="items-center mb-4">
          <TextInput 
            name="email"
            onChange={handleInputChange}
            placeholder="Work Email" />
        </div>
        <div className="items-center">
          <TextInput 
            name="company"
            onChange={handleInputChange}
            placeholder="Company" />
        </div>
      </> }
    </Card>
  </>;
}

const RegistrationCheckoutSection = ({ tierId }: { tierId: string; }) => {
  const [loading, setLoading] = useState(false);
  const [submittingPaymentMethod, setSubmittingPaymentMethod] = useState(false);
  const [purchaseIntent, setPurchaseIntent] = useState(false);

  const [userAttributes, setUserAttributes] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>();

  const { currentSession, refreshCurrentSession } = useCurrentSession();
  const { user } = currentSession;
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if(user?.id) {
      findSubscription({ tierId }).then(setSubscription);
    }
  }, [user?.id]);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    setPurchaseIntent(true);

    if(!user) {
      await RegistrationService.registerAndSignInCustomer(userAttributes).then(() => {
        refreshCurrentSession();
      }).catch((error) => {
        setError(error.message);
      }).finally(() => {
        setLoading(false);
      });
    }

    if(user && !user.stripePaymentMethodId) {
      setSubmittingPaymentMethod(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (purchaseIntent && user && user.stripePaymentMethodId) {
      onClickSubscribe(user.id, tierId).then(() => {
        // go to homepage
        setPurchaseIntent(false);
      });
    }
  }, [purchaseIntent, user?.id, user?.stripePaymentMethodId]);

  if(subscription) {
    return <AlreadySubscribedCard subscription={subscription} />
  } else return (
    <>
      <section className="w-7/8 mb-8 lg:w-5/6">
        <Divider>Register</Divider>
        { error && <div className="mb-4 text-red-500">{error}</div> }

        <RegistrationForm user={user} userAttributes={userAttributes} setUserAttributes={setUserAttributes} />
      </section>

      <section className="w-7/8 mb-8 lg:w-5/6">
        <Divider>Credit Card Information</Divider>
        <Card>
          <div className="mb-4">
            <UserPaymentMethodWidget
              loading={submittingPaymentMethod}
              setError={setError}
            />
          </div>
        </Card>
      </section>

      <section className="w-7/8 mb-8 lg:w-5/6">
        <Button onClick={onSubmit} disabled={purchaseIntent} className="w-full">
          {purchaseIntent ? <LoadingDots color="#A8A29E" /> : "Checkout"}
        </Button>
        <label className="my-2 block text-center text-sm text-slate-400">
          Your card will be charged {checkoutCurrency + " " + checkoutPrice}
        </label>
      </section>
    </>
  );
};

export default RegistrationCheckoutSection;