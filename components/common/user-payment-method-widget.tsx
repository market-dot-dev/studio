"use client";

import { useEffect, useState } from 'react';
import { Button } from '@tremor/react';
import useStripePaymentCollector, { StripeCheckoutFormWrapper } from '@/app/hooks/use-stripe-payment-method-collector';
import { canBuy, getPaymentMethod, StripeCard } from '@/app/services/StripeService';
import useCurrentSession from '@/app/hooks/use-current-session';

interface UserPaymentMethodWidgetProps {
  loading?: boolean;
  setError: (error: string | null) => void;
  setPaymentReady: (submitting: boolean) => void;
  maintainerUserId: string;
  maintainerStripeAccountId: string;
}

const UserPaymentMethodWidget = ({ loading, setPaymentReady, setError, maintainerUserId, maintainerStripeAccountId }: UserPaymentMethodWidgetProps) => {
  const { currentUser: user, refreshSession } = useCurrentSession();

  const [cardInfo, setCardInfo] = useState<StripeCard>();
  const [invalidCard, setInvalidCard] = useState<boolean>(false);

  // detect if user has a payment method attached
  useEffect(() => {
    if(user && maintainerUserId && maintainerStripeAccountId){
      canBuy(maintainerUserId, maintainerStripeAccountId).then((canBuy) => {
        if(canBuy){
          getPaymentMethod(maintainerUserId, maintainerStripeAccountId).then((paymentMethod) => {
            setCardInfo(paymentMethod);
            setPaymentReady(true);
          }).catch((error) => {
            setError(error.message);
            setInvalidCard(true);
          });
        }
      });
    }
  }, [user, user?.stripeCustomerIds, user?.stripePaymentMethodIds, maintainerStripeAccountId, maintainerUserId]);

  useEffect(() => {
    if(loading && !cardInfo){
      handleSubmit().then(refreshSession).then(() => {
        console.log('succeeded');
        setPaymentReady(true)
      }).catch((error: any) => {
        console.log('failed', error.message);
        setError(error.message)
        setPaymentReady(false);
      });
    }
  }, [loading]);

  const {
    CardElementComponent,
    stripeCustomerId,
    handleSubmit,
    handleDetach
  } = useStripePaymentCollector({ user, setError, maintainerUserId, maintainerStripeAccountId });

  if(invalidCard){
    return (
      <div className="flex flex-row justify-between items-center">
        <p className="text-sm text-stone-500">Invalid payment method. Please update your payment method.</p>
        <Button type="button" variant="secondary" className="p-1" onClick={() => handleDetach().then(refreshSession).then(() => setCardInfo(undefined))}>
          Remove
        </Button>
      </div>
    );
  }

  if(!!cardInfo){
    return (
        <div className="flex flex-row justify-between items-center">
          <p className="text-sm text-stone-500">Use saved {cardInfo?.brand.toUpperCase()} ending in {cardInfo?.last4}</p>
          <br />
          <Button type="button" variant="secondary" className="p-1" onClick={() => handleDetach().then(refreshSession).then(refreshSession).then(() => setCardInfo(undefined))}>
            Remove
          </Button>
        </div>
    );
  }

  return (
    <>
      <br />
      <CardElementComponent />
      <br />
    </>
  );
};

const UserPaymentMethodWidgetWrapper = (props: UserPaymentMethodWidgetProps) => {
  return <StripeCheckoutFormWrapper maintainerStripeAccountId={props.maintainerStripeAccountId}>
    {(innerProps: UserPaymentMethodWidgetProps) => <UserPaymentMethodWidget {...props} {...innerProps} />}
  </StripeCheckoutFormWrapper>
};

export default UserPaymentMethodWidgetWrapper;
