"use client";

import {
  Card,
  Divider,
  Text,
  Button,
} from "@tremor/react";
import UserPaymentMethodWidget from "@/components/common/user-payment-method-widget";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Subscription, User } from "@prisma/client";
import useCurrentSession from "@/app/contexts/current-user-context";

import { onClickSubscribe } from '@/app/services/StripeService';
import { findSubscriptionByTierId, isSubscribed } from '@/app/services/SubscriptionService';
import LoadingDots from "@/components/icons/loading-dots";
import Tier from "@/app/models/Tier";
import { signOut } from "next-auth/react";
import { CustomerLoginComponent } from "@/components/login/customer-login";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from '@chakra-ui/stepper'
const checkoutCurrency = "USD";

const AlreadySubscribedCard = ({ subscription }: { subscription: Subscription }) => {
  return (<Card>
    <Text>You&apos;re already subscribed to this product.</Text>
  </Card>);
}

interface RegistrationFormProps {
  user?: User;
  userAttributes: Partial<User>;
  setUserAttributes: Dispatch<SetStateAction<Partial<User>>>;
  loggedIn: boolean;
}

const steps = [
  { title: 'Sign up or Login', description: '' },
  { title: 'Enter Payment Details', description: '' },
  { title: 'Confirm', description: '' },
]

const RegistrationCheckoutSection = ({ tier }: { tier: Tier; }) => {
  const tierId = tier?.id;
  const [loading, setLoading] = useState(false);
  const [submittingPaymentMethod, setSubmittingPaymentMethod] = useState(false);
  const [purchaseIntent, setPurchaseIntent] = useState(false);

  const [userAttributes, setUserAttributes] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>();

  const { currentSession, refreshCurrentSession } = useCurrentSession();

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { user } = currentSession;

  useEffect(() => {
    if (user?.id) {
      findSubscriptionByTierId({ tierId }).then(setSubscription);
    }
  }, [user?.id, tierId]);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    setPurchaseIntent(true);

    if (user && !user.stripePaymentMethodId) {
      setSubmittingPaymentMethod(true);
      setLoading(false);
    }

  }

  useEffect(() => {
    if (purchaseIntent && user && user.stripePaymentMethodId) {
      onClickSubscribe(user.id, tierId).then((res) => {
        setPurchaseIntent(false);
        if (res.error) {
          setError(res.error);
          setLoading(false);
        } else {
          window.location.href = "/success";
        }
      });
    }
  }, [purchaseIntent, user?.id, user?.stripePaymentMethodId, tierId, user]);

  const { activeStep } = useSteps({
    index: 1,
    count: steps.length,
  })


  if (subscription) {
    return <AlreadySubscribedCard subscription={subscription} />
  } else return (
    <>
<<<<<<< Updated upstream
      <Card>
      <section className="w-7/8 mb-8 lg:w-5/6">
        <Divider className={!user?.id ? "font-bold text-lg" : ""}>Login / Signup</Divider>
        <CustomerLoginComponent signup={true} />
      </section>
      </Card>
=======
      <div className="flex flex-col w-full">
        <div className="w-1/8 border-4">
          <Stepper index={activeStep} orientation='vertical' height='400px' gap='0'>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<></>}
                  />
                </StepIndicator>
>>>>>>> Stashed changes

                <StepSeparator />
              </Step>
            ))}
          </Stepper>

<<<<<<< Updated upstream
      <section className="w-7/8 mb-8 lg:w-5/6">
        <Button onClick={onSubmit} disabled={purchaseIntent || !user?.id} className="w-full">
          {purchaseIntent ? <LoadingDots color="#A8A29E" /> : "Checkout"}
        </Button>
        <label className="my-2 block text-center text-sm text-slate-400">
          Your card will be charged {checkoutCurrency + " " + tier?.price}
        </label>
      </section>
      
=======
        </div>
        <div className="w-7/8 border-4">
          <section className="w-7/8 mb-8 lg:w-5/6">
            <Divider className={!user?.id ? "font-bold text-lg" : ""}>Login / Signup</Divider>
            <CustomerLoginComponent signup={true} />
          </section>

          <section className="w-7/8 mb-8 lg:w-5/6">
            {error && <div className="mb-4 text-red-500">{error}</div>}
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
        </div>
      </div>
>>>>>>> Stashed changes
    </>
  );
};

export default RegistrationCheckoutSection;