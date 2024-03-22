"use client";

import { useEffect, useState } from 'react';
import { Card, Button, Text } from '@tremor/react';
import useStripePaymentCollector, { StripeCheckoutFormWrapper } from '@/app/hooks/use-stripe-payment-method-collector';
import { getPaymentMethod } from '@/app/services/StripeService';
import { StripeCard } from '@/app/services/StripeService';
import { getCustomerIds } from '@/app/models/Customer';
import useCurrentSession from '@/app/hooks/use-current-session';

interface UserPaymentMethodWidgetProps {
  loading?: boolean;
  setError?: (error: string | null) => void;
  setLoading?: (submitting: boolean) => void;
  maintainerUserId: string;
  maintainerStripeAccountId: string;
}

const UserPaymentMethodWidget = ({ loading, setLoading, setError, maintainerUserId, maintainerStripeAccountId }: UserPaymentMethodWidgetProps) => {
  const setErrorOrNoop = setError ? setError : (error: string | null) => {};
  const setLoadingOrNoop = setLoading ? setLoading : (submitting: boolean) => {};
  const [cardInfo, setCardInfo] = useState<StripeCard>();
  const [stripePaymentMethodId, setStripePaymentMethodId] = useState<string | null>(null);

  const { currentUser: user, refreshSession} = useCurrentSession();

  const {
    CardElementComponent,
    stripeCustomerId,
    handleSubmit,
    handleDetach
  } = useStripePaymentCollector({ user, setError: setErrorOrNoop, setSubmitting: setLoadingOrNoop, maintainerUserId, maintainerStripeAccountId });

  useEffect(() => {
    if(user) {
      const { stripePaymentMethodId } = getCustomerIds(user, maintainerStripeAccountId);
      setStripePaymentMethodId(stripePaymentMethodId);
    }
  }, [user, maintainerStripeAccountId]);
  
  useEffect(() => {
    if (loading && user?.id && !stripePaymentMethodId) {
      handleSubmit().then(refreshSession);
    }
  }, [loading, user, handleSubmit, refreshSession]);

  useEffect(() => {
    if (stripePaymentMethodId && maintainerUserId) {
      getPaymentMethod(maintainerUserId, maintainerStripeAccountId).then((paymentMethod) => {
        setCardInfo(paymentMethod);
      });
    }
  }, [stripePaymentMethodId, maintainerUserId]);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        {stripePaymentMethodId ? (
          <div className="flex flex-row justify-between items-center">
            <Text>Use saved {cardInfo?.brand.toUpperCase()} ending in {cardInfo?.last4}</Text>
            <br />
            <Button type="button" variant="secondary" className="p-1" onClick={() => handleDetach().then(refreshSession)}>
              Remove
            </Button>
          </div>
        ) : (
          <>
            <br />
            <CardElementComponent />
            <br />
            {(loading === null || loading === undefined) && (
              <Button type="submit" disabled={false && !stripeCustomerId}>
                Save
              </Button>
            )}
          </>
        )}
      </Card>
    </form>
  );
};

const UserPaymentMethodWidgetWrapper = (props: UserPaymentMethodWidgetProps) => {
  return <StripeCheckoutFormWrapper maintainerStripeAccountId={props.maintainerStripeAccountId}>
    {(innerProps: UserPaymentMethodWidgetProps) => <UserPaymentMethodWidget {...props} {...innerProps} />}
  </StripeCheckoutFormWrapper>
};

export default UserPaymentMethodWidgetWrapper;
