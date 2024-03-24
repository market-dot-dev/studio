import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { useState, useCallback, ReactElement, ReactNode } from 'react';
import { attachPaymentMethod, detachPaymentMethod } from '@/app/services/StripeService';
import { loadStripe } from '@stripe/stripe-js';
import { User } from '@prisma/client';
import Customer from '../models/Customer';
import { SessionUser } from '../models/Session';

interface UseStripePaymentCollectorProps {
  user: User | SessionUser | null | undefined;
  setError: (error: string | null) => void;
  setSubmitting: (submitting: boolean) => void;
  maintainerUserId: string;
  maintainerStripeAccountId: string;
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

export const StripeCheckoutFormWrapper = ({ children, maintainerStripeAccountId, ...props }: {
  children: (props: any) => ReactNode;
  maintainerStripeAccountId: string;
  props?: any;
}) => {
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_NOT_SET_IN_ENV';
  const stripePromise = loadStripe(pk, {
    stripeAccount: maintainerStripeAccountId,
  });

  return <Elements stripe={stripePromise}>
    { children({ ...props }) }
  </Elements>;
};

const useStripePaymentCollector = ({ user, setError, setSubmitting, maintainerUserId, maintainerStripeAccountId }: UseStripePaymentCollectorProps): UseStripePaymentCollectorReturns => {
  const stripe = useStripe();
  const elements = useElements();
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);

  const handleSubmit = useCallback(async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe not loaded');
      return;
    }

    if(!user) {
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
    } else if (paymentMethod && maintainerUserId) {
      console.log('Payment method attached: ', paymentMethod);
      const customer = new Customer(user, maintainerUserId, maintainerStripeAccountId);
      customer.attachPaymentMethod(paymentMethod.id);
      setSubmitting(false);
    }
  }, [stripe, elements, setError, setSubmitting, maintainerUserId, maintainerStripeAccountId, user]);

  const handleDetach = useCallback(async () => {
    if (!user || !maintainerUserId) {
      return;
    }

    const customer = new Customer(user, maintainerUserId, maintainerStripeAccountId);
    await customer.detachPaymentMethod();
  }, [user, maintainerUserId, maintainerStripeAccountId]);

  return {
    CardElementComponent: StripeCardElement,
    stripeCustomerId,
    handleSubmit,
    handleDetach,
  };
};

export default useStripePaymentCollector;
