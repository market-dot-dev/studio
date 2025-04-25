"use client";

import useCurrentSession from "@/app/hooks/use-current-session";
import useStripePaymentElement, {
  StripeCheckoutFormWrapper,
  StripeWrapperStatus
} from "@/app/hooks/use-stripe-payment-element";
import { SessionUser } from "@/app/models/Session";
import { canBuy, getPaymentMethod, type StripeCard } from "@/app/services/StripeService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { CreditCard } from "lucide-react";
import { useEffect, useState } from "react";

interface StripePaymentFormProps {
  loading?: boolean;
  setError: (error: string | null) => void;
  setPaymentReady: (ready: boolean) => void;
  userId: string;
  vendorStripeAccountId: string;
}

/**
 * Main payment form component that handles the card display and Stripe integration
 */
export const StripePaymentForm = ({
  loading,
  setPaymentReady,
  setError,
  userId: userId,
  vendorStripeAccountId
}: StripePaymentFormProps) => {
  const { currentUser: user, refreshSession } = useCurrentSession();

  const [cardInfo, setCardInfo] = useState<StripeCard>();
  const [invalidCard, setInvalidCard] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // Check if user has a payment method attached
  useEffect(() => {
    if (!user || !userId || !vendorStripeAccountId) {
      setInitialLoading(false);
      return;
    }

    async function checkPaymentMethod() {
      try {
        const userCanBuy = await canBuy(userId, vendorStripeAccountId);

        if (userCanBuy) {
          try {
            const paymentMethod = await getPaymentMethod(userId, vendorStripeAccountId);
            setCardInfo(paymentMethod);
            setPaymentReady(true);
          } catch (error) {
            console.error("Error getting payment method:", error);
            setInvalidCard(true);
          }
        }
      } catch (error) {
        console.error("Error checking payment capability:", error);
      } finally {
        setInitialLoading(false);
      }
    }

    checkPaymentMethod();
  }, [user, vendorStripeAccountId, userId, setPaymentReady]);

  // Get the hook props ready to pass to the wrapper
  const hookProps = {
    user,
    setError,
    maintainerUserId: userId,
    maintainerStripeAccountId: vendorStripeAccountId
  };

  return (
    <StripeCheckoutFormWrapper
      maintainerUserId={userId}
      maintainerStripeAccountId={vendorStripeAccountId}
      hookProps={hookProps}
    >
      {({ status, stripeHook }) => (
        <StripePaymentFormContent
          loading={loading}
          setPaymentReady={setPaymentReady}
          setError={setError}
          userId={userId}
          vendorStripeAccountId={vendorStripeAccountId}
          wrapperStatus={status}
          stripeHook={stripeHook}
          user={user}
          cardInfo={cardInfo}
          setCardInfo={setCardInfo}
          invalidCard={invalidCard}
          setInvalidCard={setInvalidCard}
          initialLoading={initialLoading}
          refreshSession={refreshSession}
        />
      )}
    </StripeCheckoutFormWrapper>
  );
};

// @NOTE: This really shouldn't extend.
/**
 * Content component that renders differently based on status and card info
 */
interface StripePaymentFormContentProps extends StripePaymentFormProps {
  wrapperStatus: StripeWrapperStatus;
  stripeHook: ReturnType<typeof useStripePaymentElement> | null;
  user: User | SessionUser | null | undefined;
  cardInfo: StripeCard | undefined;
  setCardInfo: (card: StripeCard | undefined) => void;
  invalidCard: boolean;
  setInvalidCard: (invalid: boolean) => void;
  initialLoading: boolean;
  refreshSession: () => Promise<void>;
}

const StripePaymentFormContent = ({
  loading,
  setPaymentReady,
  setError,
  wrapperStatus,
  stripeHook,
  cardInfo,
  setCardInfo,
  invalidCard,
  setInvalidCard,
  initialLoading,
  refreshSession
}: StripePaymentFormContentProps) => {
  // Check if the wrapper has an error
  useEffect(() => {
    if (wrapperStatus.error) {
      setError(wrapperStatus.error);
    }
  }, [wrapperStatus.error, setError]);

  // Handle payment submission when loading prop changes
  useEffect(() => {
    if (loading && !cardInfo && wrapperStatus.isReady && stripeHook) {
      stripeHook
        .handleSubmit()
        .then(() => refreshSession())
        .then(() => {
          console.log("Payment method attached successfully");
          setPaymentReady(true);
        })
        .catch((error: any) => {
          console.error("Payment method attachment failed", error.message);
          setError(error.message);
          setPaymentReady(false);
        });
    }
  }, [loading, wrapperStatus.isReady, stripeHook]);

  // Handle loading states
  if (initialLoading || wrapperStatus.isLoading) {
    return <div className="h-12 w-full animate-pulse rounded-md bg-stone-100"></div>;
  }

  // Handle Stripe initialization errors
  if (!wrapperStatus.isReady && wrapperStatus.error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {wrapperStatus.error || "Unable to initialize payment form. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  // If Stripe isn't ready and there's no error, it's still initializing
  if (!wrapperStatus.isReady) {
    return <div className="text-sm text-stone-500">Initializing payment form...</div>;
  }

  // At this point, we should have the stripeHook available
  if (!stripeHook) {
    return <div className="text-sm text-red-600">Error loading payment form.</div>;
  }

  const { PaymentElementComponent, handleSubmit, handleDetach, isProcessing } = stripeHook;

  if (invalidCard) {
    return (
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm text-stone-500">
          Invalid payment method. Please update your payment method.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={async () => {
            try {
              await handleDetach();
              await refreshSession();
              setCardInfo(undefined);
              setInvalidCard(false);
            } catch (error: any) {
              setError(error.message);
            }
          }}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Remove"}
        </Button>
      </div>
    );
  }

  if (cardInfo) {
    return (
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="text-stone-500" />
          <p className="text-sm font-semibold">
            {cardInfo?.brand.toUpperCase()} ••••{cardInfo?.last4}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={async () => {
            try {
              await handleDetach();
              await refreshSession();
              setCardInfo(undefined);
            } catch (error: any) {
              setError(error.message);
            }
          }}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Use another card"}
        </Button>
      </div>
    );
  }

  // If no card info exists, show the payment element
  return (
    <div className="space-y-4">
      <PaymentElementComponent />
      {loading && <div className="text-sm text-stone-500">Processing payment information...</div>}
    </div>
  );
};
