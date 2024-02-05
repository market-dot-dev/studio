import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { useState, useCallback, ReactElement, ReactNode } from 'react';
import { attachPaymentMethod, detachPaymentMethod } from '@/app/services/StripeService';
import { loadStripe } from '@stripe/stripe-js';
import { User } from '@prisma/client';
import { createStripeCustomerById } from '@/app/services/UserService';

const stripePromise = loadStripe('pk_test_ki6H49wdOldcE2KR7m5p8ulH00rsY96tmR');

interface UseStripePaymentCollectorProps {
  user: User | null | undefined;
  setError: (error: string | null) => void;
  setSubmitting: (submitting: boolean) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      },
      border: '1px solid #e2e8f0',
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

interface UseStripePaymentCollectorReturns {
  CardElementComponent: () => ReactElement;
  stripeCustomerId: string | null;
  handleSubmit: (event?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDetach: () => Promise<void>;
}

export const StripeCardElement = () => {
  return <CardElement options={CARD_ELEMENT_OPTIONS} />
}

export const StripeCheckoutFormWrapper = ({ children, ...props }: { children: (props: any) => ReactNode; props?: any; }) => {
  return <Elements stripe={stripePromise}>
    { children({ ...props }) }
  </Elements>;
};

const useStripePaymentCollector = ({ user, setError, setSubmitting }: UseStripePaymentCollectorProps): UseStripePaymentCollectorReturns => {
  const stripe = useStripe();
  const elements = useElements();
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);

  const handleSubmit = useCallback(async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe not loaded');
      return;
    }

    setSubmitting(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message || '');
      setSubmitting(false);
    } else if (paymentMethod) {
      console.log('Payment method attached: ', paymentMethod);
      await attachPaymentMethod(paymentMethod.id);
      setStripeCustomerId(await createStripeCustomerById(user?.id || ''));
      setSubmitting(false);
    }
  }, [stripe, elements, setError, setSubmitting]);

  const handleDetach = useCallback(async () => {
    if (user?.stripePaymentMethodId) {
      await detachPaymentMethod(user?.stripePaymentMethodId);
    }
  }, [user]);

  return {
    CardElementComponent: StripeCardElement,
    stripeCustomerId,
    handleSubmit,
    handleDetach,
  };
};

export default useStripePaymentCollector;
