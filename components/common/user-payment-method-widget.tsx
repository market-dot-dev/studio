"use client";

import { useEffect, useState } from 'react';
import { Card, Button } from '@tremor/react';
import useStripePaymentCollector, { StripeCheckoutFormWrapper } from '@/app/hooks/use-stripe-payment-method-collector';
import { getStripePaymentMethodIdById, getCurrentUser } from '@/app/services/UserService';
import { User } from '@prisma/client';

interface UserPaymentMethodWidgetProps {
  userId: string | null | undefined;
  submitting?: boolean;
  setError?: (error: string | null) => void;
  setSubmitting?: (submitting: boolean) => void;
}

const UserPaymentMethodWidget = ({ userId, submitting, setSubmitting, setError }: UserPaymentMethodWidgetProps) => {
  const setErrorOrNoop = setError ? setError : (error: string | null) => {};
  const setSubmittingOrNoop = setSubmitting ? setSubmitting : (submitting: boolean) => {};
  const [stripePaymentMethodId, setStripePaymentMethodId] = useState<string | null>(null);

  const [user, setUser] = useState<User | null | undefined>(null);

  useEffect(() => {
    if(userId && !user) {
      getCurrentUser().then(setUser);
    }
  }, [userId, JSON.stringify(user)]);

  console.log(user);

  const {
    CardElementComponent,
    stripeCustomerId,
    handleSubmit,
    handleDetach
  } = useStripePaymentCollector({ userId, setError: setErrorOrNoop, stripePaymentMethodId, setStripePaymentMethodId, setSubmitting: setSubmittingOrNoop });

  useEffect(() => {
    if (userId && !stripePaymentMethodId) {
      getStripePaymentMethodIdById(userId)
        .then(setStripePaymentMethodId)
        .catch((error) => {
          setError && setError(error.message);
        });
    }
  }, [userId, setError, stripePaymentMethodId]);

  useEffect(() => {
    if (submitting && userId && !stripePaymentMethodId) {
      handleSubmit();
    }
  }, [submitting, userId, stripePaymentMethodId, handleSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        {stripePaymentMethodId ? (
          <>
            Payment method already saved
            <br />
            <Button type="button" onClick={handleDetach}>
              Remove
            </Button>
          </>
        ) : (
          <>
            <br />
            <CardElementComponent />
            <br />
            {(submitting === null || submitting === undefined) && (
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
