"use client";

import {
  Card,
  Divider,
  Text,
  Button,
  Flex,
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
import { Check } from "lucide-react";

const checkoutCurrency = "USD";
  "Nokogiri is an HTML, XML, SAX, and Reader parser. Among Nokogiri's many features is the ability to search documents via XPath or CSS3 selectors. XML is like violence - if it doesn’t solve your problems, you are not using enough of it.";

const AlreadySubscribedCard = () => {
  return (<Card>
    <Text>You&apos;re already subscribed to this product.</Text>
  </Card>);
}

const Step = ({ step, currentStep } : { step: number, currentStep: number }) => {
  return (
    <Flex alignItems="center" justifyContent="center" className="w-8 h-8 bg-slate-300 rounded-full text-white">
      <Text className="text-2xl font-bold">
        { currentStep > step ? 
          <Check size="18" />
         : step }
      </Text>
    </Flex>
  )
}

const RegistrationCheckoutSection = ({ tier }: { tier: Tier; }) => {
  const tierId = tier?.id;
  const [loading, setLoading] = useState(false);
  const [submittingPaymentMethod, setSubmittingPaymentMethod] = useState(false);
  const [purchaseIntent, setPurchaseIntent] = useState(false);

  const [userAttributes, setUserAttributes] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>();

  const { currentSession, refreshCurrentSession } = useCurrentSession();

  const [currentStep, setCurrentStep] = useState(1);

  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = currentSession;
  
  useEffect(() => {
    if( user?.id ) {
      if(user?.stripePaymentMethodId) {
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
    } else {
      setCurrentStep(1);
    }

  }, [user?.id, user?.stripePaymentMethodId]);

  useEffect(() => {
    if(user?.id) {
      isSubscribedByTierId(user.id, tierId).then(setIsSubscribed);
    }
  }, [user?.id, tierId]);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    setPurchaseIntent(true);

    if(user && !user.stripePaymentMethodId) {
      setSubmittingPaymentMethod(true);
      setLoading(false);
    }
    
  }

  useEffect(() => {
    if (purchaseIntent && user && user.stripePaymentMethodId) {
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
  }, [purchaseIntent, user?.id, user?.stripePaymentMethodId, tierId, user]);

  if(isSubscribed) {
    return <AlreadySubscribedCard />
  } else return (
    <>
      <section className="w-7/8 mb-8 lg:w-5/6">
        <Divider className={!user?.id ? "font-bold text-lg" : ""}>Login / Signup</Divider>
        
        <Flex>
          <Flex alignItems="center" justifyContent="start" className="w-16">
            <Step step={1} currentStep={currentStep} />
          </Flex>
          <div className='grow'>
            
            <Card>
              <CustomerLoginComponent signup={true} />
            </Card>
          </div>
        </Flex>
      </section>

      <section className="w-7/8 mb-8 lg:w-5/6">
        { error && <div className="mb-4 text-red-500">{error}</div> }
        <Divider className={user?.id ? "font-bold text-lg" : ""}>Credit Card Information</Divider>
        <Flex>
          <Flex alignItems="center" justifyContent="start" className="w-16">
            <Step step={2} currentStep={currentStep} />
          </Flex>
          <div className='grow'>
            <UserPaymentMethodWidget
              loading={submittingPaymentMethod}
              setError={setError}
            />
          </div>
        </Flex>
      </section>

      <section className="w-7/8 mb-8 lg:w-5/6">
        <Flex alignItems="start">
          <Flex alignItems="center" justifyContent="start" className="w-16">
            <Step step={3} currentStep={currentStep} />
          </Flex>
          <Flex flexDirection="col" alignItems="center" className='grow'>
            <Button onClick={onSubmit} disabled={purchaseIntent || !user?.id} className="w-full">
              {purchaseIntent ? <LoadingDots color="#A8A29E" /> : "Checkout"}
            </Button>
            <label className="my-2 block text-center text-sm text-slate-400">
              Your card will be charged {checkoutCurrency + " " + tier?.price}
            </label>
          </Flex>
        </Flex>
      </section>
    </>
  );
};

export default RegistrationCheckoutSection;