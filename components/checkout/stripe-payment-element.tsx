"use client";

import {
  addUserPaymentMethod,
  createUserSetupIntent,
  getUserPaymentMethod,
  removeUserPaymentMethod
} from "@/app/services/checkout-service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";

interface SimplePaymentElementProps {
  userId: string;
  vendorStripeAccountId: string;
  setPaymentReady: (ready: boolean) => void;
}

export function SimplePaymentElement({
  userId,
  vendorStripeAccountId,
  setPaymentReady
}: SimplePaymentElementProps) {
  const [status, setStatus] = useState<"loading" | "card" | "form">("loading");
  const [systemError, setSystemError] = useState<string | null>(null);
  const [card, setCard] = useState<{ brand: string; last4: string } | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  // Initialize by checking for existing payment method
  useEffect(() => {
    async function loadPaymentMethod() {
      try {
        setSystemError(null);
        const paymentMethod = await getUserPaymentMethod(userId, vendorStripeAccountId);

        if (paymentMethod) {
          setCard(paymentMethod);
          setStatus("card");
          setPaymentReady(true);
        } else {
          // No card found, prepare to show form
          await initializePaymentForm();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load payment information";
        setSystemError(errorMessage);
        // Still show the form if possible, allowing user to try adding payment details
        await initializePaymentForm();
      }
    }

    async function initializePaymentForm() {
      try {
        const { clientSecret, error } = await createUserSetupIntent(userId, vendorStripeAccountId);

        if (error || !clientSecret) {
          throw new Error(error || "Failed to initialize payment form");
        }

        setClientSecret(clientSecret);
        setStatus("form");
        setPaymentReady(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to initialize payment form";
        setSystemError(errorMessage);
        // We're still in a state where we can't show the form
        setStatus("loading");
        setPaymentReady(false);
      }
    }

    if (userId && vendorStripeAccountId) {
      loadPaymentMethod();
    }
  }, [userId, vendorStripeAccountId, setPaymentReady]);

  // Handle removing a card
  const handleRemoveCard = async () => {
    setIsProcessing(true);
    setSystemError(null);

    try {
      const result = await removeUserPaymentMethod(userId, vendorStripeAccountId);

      if (!result.success) {
        throw new Error(result.error || "Failed to remove payment method");
      }

      // Prepare to show form for adding new card
      const { clientSecret, error } = await createUserSetupIntent(userId, vendorStripeAccountId);

      if (error || !clientSecret) {
        throw new Error(error || "Failed to initialize payment form");
      }

      setCard(null);
      setClientSecret(clientSecret);
      setStatus("form");
      setPaymentReady(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setSystemError(errorMessage);
      // We maintain the card state so user can try again
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = async () => {
    setSystemError(null);
    setIsProcessing(true);

    try {
      // Reinitialize the payment flow
      const { clientSecret, error } = await createUserSetupIntent(userId, vendorStripeAccountId);

      if (error || !clientSecret) {
        throw new Error(error || "Failed to initialize payment form");
      }

      setClientSecret(clientSecret);
      setStatus("form");
      setPaymentReady(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reinitialize payment form";
      setSystemError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Show system error as banner but still allow user to continue if possible
  const errorBanner = systemError ? (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="mr-2 size-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{systemError}</span>
        <Button size="sm" variant="outline" onClick={handleRetry} className="ml-2">
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  ) : null;

  // Render functions for different states
  const loadingState = () => (
    <motion.div
      key="loading"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div className="h-12 w-full animate-pulse rounded-md bg-stone-100"></div>
    </motion.div>
  );

  const cardState = () => (
    <motion.div
      key="card"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div>
        {errorBanner}
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard size={20} className="text-stone-500" />
            <p className="text-sm font-semibold">
              {card?.brand.toUpperCase()} ••••{card?.last4}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleRemoveCard}
            disabled={isProcessing}
          >
            Use another card
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const formState = () => (
    <motion.div
      key="form"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div>
        {errorBanner}
        <div className="-mt-1">
          <CardSetupForm
            clientSecret={clientSecret!}
            vendorStripeAccountId={vendorStripeAccountId}
            userId={userId}
            status={status}
            onSuccess={(newCard) => {
              setSystemError(null);
              setCard(newCard);
              setStatus("card");
              setPaymentReady(true);
            }}
            onError={(errorMessage) => {
              // Just set the system error but keep the form visible
              setSystemError(errorMessage);
            }}
          />
        </div>
      </div>
    </motion.div>
  );

  const errorState = () => (
    <motion.div
      key="error"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div>
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="mr-2 size-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{systemError}</span>
            <Button size="sm" variant="outline" onClick={handleRetry} className="ml-2">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    if (status === "loading" || isProcessing) {
      return loadingState();
    }

    if (status === "card" && card) {
      return cardState();
    }

    if (status === "form" && clientSecret) {
      return formState();
    }

    if (systemError) {
      return errorState();
    }

    return null;
  };

  return <AnimatePresence mode="popLayout">{renderContent()}</AnimatePresence>;
}

interface CardSetupFormProps {
  clientSecret: string;
  vendorStripeAccountId: string;
  userId: string;
  status: "loading" | "card" | "form";
  onSuccess: (card: { brand: string; last4: string }) => void;
  onError: (errorMessage: string) => void;
}

function CardSetupForm({
  clientSecret,
  vendorStripeAccountId,
  userId,
  status,
  onSuccess,
  onError
}: CardSetupFormProps) {
  const [stripePromise] = useState(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
    return loadStripe(pk, { stripeAccount: vendorStripeAccountId });
  });

  if (!stripePromise || !clientSecret) {
    return <div className="text-sm text-stone-500">Preparing payment form...</div>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#929263",
            colorText: "#292524",
            colorTextSecondary: "#766F6B",
            focusOutline: "2px",
            fontFamily: "system-ui, sans-serif",
            spacingUnit: "4px",
            gridRowSpacing: "16px",
            borderRadius: "4px"
          },
          rules: {
            ".Label": {
              fontWeight: "600",
              marginBottom: "8px"
            },
            ".Input": {
              height: "36px",
              paddingTop: "8px",
              paddingBottom: "8px",
              paddingLeft: "12px",
              paddingRight: "12px",
              borderColor: "#e7e5e4"
            },
            ".Input:focus": {
              boxShadow: "0 0 0 1px #929263"
            },
            ".TermsText": {
              fontSize: "12px",
              lineHeight: "16px"
            },
            ".Tab": {
              transition: "background-color 0.2s ease"
            },
            ".Tab--selected, .Tab:focus, .Tab:active": {
              backgroundColor: "#929263",
              color: "white"
            },
            ".TabIcon": {
              transition: "color 0.2s ease"
            },
            ".Tab--selected .TabIcon, .Tab:focus .TabIcon, .Tab:active .TabIcon": {
              color: "white"
            },
            ".TabLabel": {
              transition: "color 0.2s ease"
            },
            ".Tab--selected .TabLabel, .Tab:focus .TabLabel, .Tab:active .TabLabel": {
              color: "white"
            }
          }
        }
      }}
    >
      <CardSetupFormContent
        userId={userId}
        vendorStripeAccountId={vendorStripeAccountId}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}

interface CardSetupFormContentProps {
  userId: string;
  vendorStripeAccountId: string;
  onSuccess: (card: { brand: string; last4: string }) => void;
  onError: (errorMessage: string) => void;
}

function CardSetupFormContent({
  userId,
  vendorStripeAccountId,
  onSuccess,
  onError
}: CardSetupFormContentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError("Payment processing not available. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      // Confirm the setup intent
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`
        },
        redirect: "if_required"
      });

      if (error) {
        // This is a validation error from Stripe - handled inline by Stripe Elements
        // Just set a simple form error message for context - Stripe displays details
        setFormError("Please check your card details and try again.");
        return;
      }

      if (setupIntent?.status === "succeeded" && setupIntent.payment_method) {
        // Attach the payment method to the user
        const result = await addUserPaymentMethod(
          setupIntent.payment_method as string,
          userId,
          vendorStripeAccountId
        );

        if (!result.success) {
          throw new Error(result.error || "Failed to save payment method");
        }

        // Get the updated card info
        const card = await getUserPaymentMethod(userId, vendorStripeAccountId);
        if (!card) {
          throw new Error("Payment method was set up but could not be retrieved");
        }

        setFormError(null);
        onSuccess(card);
      } else {
        throw new Error("Payment setup was not completed successfully");
      }
    } catch (err) {
      // This is a system error, not a validation error
      const errorMessage = err instanceof Error ? err.message : "Failed to set up payment method";
      onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement
        options={{
          layout: { type: "tabs" }
        }}
      />
      <AnimatePresence>
        {formError && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center overflow-hidden rounded border border-rose-200 bg-red-50 px-2.5 py-2 text-sm text-rose-600"
          >
            <AlertTriangle className="mr-3 size-4 -translate-y-px" />
            {formError}
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        type="submit"
        disabled={!stripe || !elements}
        loading={isSubmitting}
        className="w-full"
      >
        Save card
      </Button>
    </form>
  );
}
