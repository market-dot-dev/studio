import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { useState, useCallback, ReactElement, ReactNode } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { User } from '@prisma/client';
import { SessionUser } from '../models/Session';
import { attachPaymentMethod, detachPaymentMethod } from '../services/StripeService';

interface UseStripePaymentCollectorProps {
  user: User | SessionUser | null | undefined;
  setError: (error: string | null) => void;
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
  CardElementComponent: () => ReactElement<any>;
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
  }).catch((err) => {
    console.error('Failed to load stripe', err);
    return null;
  });

  return <Elements stripe={stripePromise}>
    { children({ ...props }) }
  </Elements>;
};

const useStripePaymentCollector = ({ user, setError, maintainerUserId, maintainerStripeAccountId }: UseStripePaymentCollectorProps): UseStripePaymentCollectorReturns => {
  const stripe = useStripe();
  const elements = useElements();
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);

  const handleSubmit = useCallback(async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!stripe || !elements) {
      return Promise.reject('Stripe not loaded')
    }

    if(!user) {
      return Promise.reject('User not found')
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return Promise.reject('Card element not found');
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message || '');
      return Promise.reject(error || '');
    } else if (paymentMethod && maintainerUserId) {
      console.log('Payment method attached: ', paymentMethod);
      await attachPaymentMethod(paymentMethod.id, maintainerUserId, maintainerStripeAccountId);
    }
  }, [stripe, elements, setError, maintainerUserId, maintainerStripeAccountId, user]);

  const handleDetach = useCallback(async () => {
    if (!user || !maintainerUserId) {
      return;
    }

    await detachPaymentMethod(maintainerUserId, maintainerStripeAccountId);
  }, [user, maintainerUserId, maintainerStripeAccountId]);

  return {
    CardElementComponent: StripeCardElement,
    stripeCustomerId,
    handleSubmit,
    handleDetach,
  };
};

export default useStripePaymentCollector;
