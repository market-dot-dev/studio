import { useStripe, useElements, CardElement, Elements, PaymentElement } from '@stripe/react-stripe-js';
import { useState, useCallback, ReactElement, ReactNode, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { User } from '@prisma/client';
import { SessionUser } from '../models/Session';
import { attachPaymentMethod, detachPaymentMethod, createSetupIntent } from '../services/StripeService';
import type { StripePaymentElementOptions, StripeElementsOptions, Appearance } from '@stripe/stripe-js';

interface UseStripePaymentCollectorProps {
  user: User | SessionUser | null | undefined;
  setError: (error: string | null) => void;
  maintainerUserId: string;
  maintainerStripeAccountId: string;
}

// Define the appearance separately
const appearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#0570de',
    colorBackground: '#ffffff',
    colorText: '#32325d',
    colorDanger: '#fa755a',
    fontFamily: 'Arial, sans-serif',
    spacingUnit: '4px',
    borderRadius: '4px',
  },
};

// Payment Element appearance options
const PAYMENT_ELEMENT_OPTIONS: StripePaymentElementOptions = {
  layout: {
    type: 'tabs' as const,
    defaultCollapsed: false,
  },
  business: {
    name: 'market.dev',
  },
};

interface UseStripePaymentCollectorReturns {
  CardElementComponent: () => ReactElement;
  stripeCustomerId: string | null;
  handleSubmit: (event?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDetach: () => Promise<void>;
}

export const StripePaymentElement = () => {
  return <PaymentElement options={PAYMENT_ELEMENT_OPTIONS} />
}

// Add this new MockPaymentElement component
const MockPaymentElement = () => {
  return (
    <div className="relative group">
      {/* Overlay that appears on hover */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md z-10">
        <div className="text-center p-3 bg-white rounded shadow-md">
          <p className="text-sm font-medium text-stone-800 mb-2">Please sign in to add a payment method</p>
        </div>
      </div>
      
      {/* Mock payment form */}
      <div className="border border-gray-200 rounded-md p-4 bg-white opacity-60">
        <div className="mb-4 border-b pb-2">
          <div className="flex justify-between mb-2">
            <div className="h-5 w-5 rounded-full bg-gray-300"></div>
            <div className="flex gap-1">
              <div className="h-5 w-8 rounded bg-gray-300"></div>
              <div className="h-5 w-8 rounded bg-gray-300"></div>
              <div className="h-5 w-8 rounded bg-gray-300"></div>
            </div>
          </div>
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
        </div>
        
        {/* Card number field */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">Card number</label>
          <div className="h-10 bg-gray-100 rounded border border-gray-300 px-3 flex items-center justify-between">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-5 w-5 rounded-full bg-gray-300"></div>
          </div>
        </div>
        
        {/* Expiry and CVC row */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-500 mb-1">Expiration</label>
            <div className="h-10 bg-gray-100 rounded border border-gray-300 px-3 flex items-center">
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-500 mb-1">CVC</label>
            <div className="h-10 bg-gray-100 rounded border border-gray-300 px-3 flex items-center justify-between">
              <div className="h-4 w-10 bg-gray-300 rounded"></div>
              <div className="h-5 w-5 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export const StripeCheckoutFormWrapper = ({ children, maintainerStripeAccountId, maintainerUserId, ...props }: {
  children: (props: any) => ReactNode;
  maintainerStripeAccountId: string;
  maintainerUserId: string;
  props?: any;
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true); // Assume logged in initially

  useEffect(() => {
    const fetchSetupIntent = async () => {
      try {
        setIsLoading(true);
        const { clientSecret: secret } = await createSetupIntent(
          maintainerUserId,
          maintainerStripeAccountId
        );
        setClientSecret(secret);
      } catch (err: any) {
        console.error('Error fetching setup intent:', err);
        // Check if the error is due to user not being logged in
        if (err.message === 'User not found') {
          setIsUserLoggedIn(false);
        } else {
          setError(err.message || 'Failed to initialize payment form');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSetupIntent();
  }, [maintainerUserId, maintainerStripeAccountId]);

  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_NOT_SET_IN_ENV';
  const stripePromise = loadStripe(pk, {
    stripeAccount: maintainerStripeAccountId,
  }).catch((err) => {
    console.error('Failed to load stripe', err);
    return null;
  });

  if (isLoading) {
    return <div className="text-center p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-2">Loading payment form...</p>
    </div>;
  }

  if (!isUserLoggedIn) {
    return <MockPaymentElement />;
  }

  if (error || !clientSecret) {
    return <div className="text-center p-4 text-red-500">
      {error || 'Unable to initialize payment form. Please try again later.'}
    </div>;
  }

  // Setup options with PaymentElement required parameters
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return <Elements stripe={stripePromise} options={options}>
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

    // With PaymentElement we use confirmSetup instead of createPaymentMethod
    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-confirmation`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setError(error.message || '');
      return Promise.reject(error || '');
    } else if (setupIntent && setupIntent.payment_method && maintainerUserId) {
      console.log('Payment method attached: ', setupIntent.payment_method);
      // Extract payment method ID if it's an object, or use the string directly
      const paymentMethodId = typeof setupIntent.payment_method === 'string' 
        ? setupIntent.payment_method 
        : setupIntent.payment_method.id;
      await attachPaymentMethod(paymentMethodId, maintainerUserId, maintainerStripeAccountId);
    }
  }, [stripe, elements, setError, maintainerUserId, maintainerStripeAccountId, user]);

  const handleDetach = useCallback(async () => {
    if (!user || !maintainerUserId) {
      return;
    }

    await detachPaymentMethod(maintainerUserId, maintainerStripeAccountId);
  }, [user, maintainerUserId, maintainerStripeAccountId]);

  return {
    CardElementComponent: StripePaymentElement, // Note: We keep the same prop name for backward compatibility
    stripeCustomerId,
    handleSubmit,
    handleDetach,
  };
};

export default useStripePaymentCollector;
