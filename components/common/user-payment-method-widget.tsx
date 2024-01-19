"use client";

import { useEffect } from 'react';
import { Card, Button } from '@tremor/react';
import useStripePaymentCollector, { StripeCheckoutFormWrapper } from '@/app/hooks/use-stripe-payment-method-collector';
import useCurrentSession from '@/app/contexts/current-user-context';

interface UserPaymentMethodWidgetProps {
  loading?: boolean;
  setError?: (error: string | null) => void;
  setLoading?: (submitting: boolean) => void;
}

const UserPaymentMethodWidget = ({ loading, setLoading, setError }: UserPaymentMethodWidgetProps) => {
  const setErrorOrNoop = setError ? setError : (error: string | null) => {};
  const setLoadingOrNoop = setLoading ? setLoading : (submitting: boolean) => {};

  const { currentSession, refreshCurrentSession } = useCurrentSession();
  const user = currentSession.user;

  const {
    CardElementComponent,
    stripeCustomerId,
    handleSubmit,
    handleDetach
  } = useStripePaymentCollector({ user, setError: setErrorOrNoop, setSubmitting: setLoadingOrNoop });

  useEffect(() => {
    if (loading && user?.id && !user?.stripePaymentMethodId) {
      handleSubmit().then(refreshCurrentSession);
    }
  }, [loading, user, handleSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        {user?.stripePaymentMethodId ? (
          <div className="flex flex-row">
            Payment method already saved
            <br />
            <Button type="button" onClick={() => handleDetach().then(refreshCurrentSession)}>
              Remove
            </Button>
          </div>
        ) : (
          <>
            <br />
            <CardElementComponent />
            <br />
            {(loading === null || loading === undefined) && (
              <Button type="submit" disabled={!stripeCustomerId}>
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

export default UserPaymentMethodWidgetWrapper;
