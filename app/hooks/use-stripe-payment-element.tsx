import { User } from "@prisma/client";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { ReactElement, ReactNode, useCallback, useEffect, useState } from "react";
import { SessionUser } from "../models/Session";
import {
  attachPaymentMethod,
  createSetupIntent,
  detachPaymentMethod
} from "../services/StripeService";

interface UseStripePaymentElementProps {
  user: User | SessionUser | null | undefined;
  setError: (error: string | null) => void;
  maintainerUserId: string;
  maintainerStripeAccountId: string;
}

// Configuration for PaymentElement appearance and behavior
const PAYMENT_ELEMENT_OPTIONS = {
  layout: {
    type: "tabs" as const,
    defaultCollapsed: false
  }
};

// Appearance for Stripe Elements
const PAYMENT_ELEMENT_APPEARANCE = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#0570de",
    colorBackground: "#ffffff",
    colorText: "#32325d",
    colorDanger: "#fa755a",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    spacingUnit: "4px",
    borderRadius: "4px"
  }
};

// Interface for hook return values
interface UseStripePaymentElementReturns {
  PaymentElementComponent: () => ReactElement;
  handleSubmit: (event?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDetach: () => Promise<void>;
  isProcessing: boolean;
}

// PaymentElement component
const StripePaymentElement = () => {
  return (
    <div className="w-full">
      <PaymentElement options={PAYMENT_ELEMENT_OPTIONS} />
    </div>
  );
};

// Prepare the Stripe promise once
const getStripePromise = (accountId: string): Promise<Stripe | null> => {
  const pk =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_NOT_SET_IN_ENV";

  return loadStripe(pk, { stripeAccount: accountId });
};

// Interface for wrapper status
export interface StripeWrapperStatus {
  isLoading: boolean;
  error: string | null;
  isReady: boolean;
}

const useStripePaymentElement = ({
  user,
  setError,
  maintainerUserId,
  maintainerStripeAccountId
}: UseStripePaymentElementProps): UseStripePaymentElementReturns => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      if (event) {
        event.preventDefault();
      }

      setIsProcessing(true);

      try {
        if (!stripe || !elements) {
          throw new Error("Stripe not loaded");
        }

        if (!user) {
          throw new Error("User not found");
        }

        // Confirm the setup intent with the PaymentElement
        const { error, setupIntent } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment-success`
          },
          redirect: "if_required"
        });

        if (error) {
          throw error;
        }

        if (setupIntent?.status === "succeeded") {
          // If payment method was created successfully, attach it
          if (setupIntent.payment_method) {
            await attachPaymentMethod(
              setupIntent.payment_method as string,
              maintainerUserId,
              maintainerStripeAccountId
            );
          }
        } else if (setupIntent?.status === "processing") {
          throw new Error("Your payment is processing. We'll update you when it's complete.");
        } else if (setupIntent?.status === "requires_payment_method") {
          throw new Error("Your payment was not successful, please try again.");
        }
      } catch (error: any) {
        setError(error.message || "An unexpected error occurred");
        return Promise.reject(error);
      } finally {
        setIsProcessing(false);
      }
    },
    [stripe, elements, setError, maintainerUserId, maintainerStripeAccountId, user]
  );

  const handleDetach = useCallback(async () => {
    if (!user || !maintainerUserId) {
      return;
    }

    setIsProcessing(true);
    try {
      await detachPaymentMethod(maintainerUserId, maintainerStripeAccountId);
    } catch (error: any) {
      setError(error.message || "Failed to remove payment method");
    } finally {
      setIsProcessing(false);
    }
  }, [user, maintainerUserId, maintainerStripeAccountId, setError]);

  return {
    PaymentElementComponent: StripePaymentElement,
    handleSubmit,
    handleDetach,
    isProcessing
  };
};

// Wrapper props interface
interface StripeCheckoutFormWrapperProps {
  children: (props: {
    status: StripeWrapperStatus;
    stripeHook: UseStripePaymentElementReturns | null;
  }) => ReactNode;
  maintainerUserId: string;
  maintainerStripeAccountId: string;
  hookProps: UseStripePaymentElementProps;
}

// The Elements provider wrapper
export const StripeCheckoutFormWrapper = ({
  children,
  maintainerUserId,
  maintainerStripeAccountId,
  hookProps
}: StripeCheckoutFormWrapperProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  // Initialize Stripe
  useEffect(() => {
    if (maintainerStripeAccountId) {
      setStripePromise(getStripePromise(maintainerStripeAccountId));
    }
  }, [maintainerStripeAccountId]);

  // Create setup intent for payment collection
  useEffect(() => {
    if (!maintainerUserId || !maintainerStripeAccountId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    async function fetchSetupIntent() {
      try {
        const result = await createSetupIntent(maintainerUserId, maintainerStripeAccountId);

        if (result.error) {
          throw new Error(result.error);
        }

        if (!result.clientSecret) {
          throw new Error("Failed to create setup intent");
        }

        setClientSecret(result.clientSecret);
        setError(null);
      } catch (error: any) {
        console.error("Error creating setup intent:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSetupIntent();
  }, [maintainerUserId, maintainerStripeAccountId]);

  // Calculate if Stripe is ready to be used
  const isReady = !isLoading && !error && !!clientSecret && !!stripePromise;

  // The status object to pass to children
  const status: StripeWrapperStatus = {
    isLoading,
    error,
    isReady
  };

  // Only render Elements when everything is ready
  if (isReady && clientSecret) {
    return (
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: PAYMENT_ELEMENT_APPEARANCE
        }}
      >
        <StripeHookProvider hookProps={hookProps} status={status}>
          {children}
        </StripeHookProvider>
      </Elements>
    );
  }

  // Otherwise pass null for the hook
  return <>{children({ status, stripeHook: null })}</>;
};

// Component to safely provide the hook
function StripeHookProvider({
  children,
  hookProps,
  status
}: {
  children: (props: {
    status: StripeWrapperStatus;
    stripeHook: UseStripePaymentElementReturns;
  }) => ReactNode;
  hookProps: UseStripePaymentElementProps;
  status: StripeWrapperStatus;
}) {
  // Only call the hook when inside the Elements provider
  const stripeHook = useStripePaymentElement(hookProps);
  return <>{children({ status, stripeHook })}</>;
}

export default useStripePaymentElement;
