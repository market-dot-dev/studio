"use client";

import { useEffect, useState } from 'react';
import { Card, Button, Text } from '@tremor/react';
import useStripePaymentCollector, { StripeCheckoutFormWrapper } from '@/app/hooks/use-stripe-payment-method-collector';
import useCurrentSession, { CurrentSessionProvider } from '@/app/contexts/current-user-context';
import { getPaymentMethod } from '@/app/services/StripeService';
import { StripeCard } from '@/app/services/StripeService';
import { getCustomerIds } from '@/app/models/Customer';

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

  const { currentSessionUser: user, refreshCurrentSessionUser } = useCurrentSession();

  const {
    CardElementComponent,
    stripeCustomerId,
    handleSubmit,
    handleDetach
  } = useStripePaymentCollector({ user, setError: setErrorOrNoop, setSubmitting: setLoadingOrNoop, maintainerUserId, maintainerStripeAccountId });

  useEffect(() => {
    if(user) {
      const { stripePaymentMethodId } = getCustomerIds(user, maintainerUserId);
      setStripePaymentMethodId(stripePaymentMethodId);
    }
  }, []);
  
  useEffect(() => {
    if (loading && user?.id && stripePaymentMethodId) {
      handleSubmit().then(refreshCurrentSessionUser);
    }
  }, [loading, user, handleSubmit, refreshCurrentSessionUser]);

  useEffect(() => {
    if (stripePaymentMethodId && maintainerUserId) {
      getPaymentMethod(stripePaymentMethodId, maintainerUserId).then((paymentMethod) => {
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
            <Button type="button" variant="secondary" className="p-1" onClick={() => handleDetach().then(refreshCurrentSessionUser)}>
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
  return <StripeCheckoutFormWrapper>
    {(innerProps: UserPaymentMethodWidgetProps) => <UserPaymentMethodWidget {...props} {...innerProps} />}
  </StripeCheckoutFormWrapper>
};

export const UserPaymentMethodWidgetWrapperSSR = (props: UserPaymentMethodWidgetProps) => {
  return <CurrentSessionProvider>
    <StripeCheckoutFormWrapper>
      {(innerProps: UserPaymentMethodWidgetProps) => <UserPaymentMethodWidget {...props} {...innerProps} />}
    </StripeCheckoutFormWrapper>
  </CurrentSessionProvider>;
};

export default UserPaymentMethodWidgetWrapper;
