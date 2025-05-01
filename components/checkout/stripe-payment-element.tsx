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
import { CreditCard } from "lucide-react";
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
  const [status, setStatus] = useState<"loading" | "card" | "form" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState<{ brand: string; last4: string } | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize by checking for existing payment method
  useEffect(() => {
    async function loadPaymentMethod() {
      try {
        const paymentMethod = await getUserPaymentMethod(userId, vendorStripeAccountId);

        if (paymentMethod) {
          setCard(paymentMethod);
          setStatus("card");
          setPaymentReady(true);
        } else {
          // No card found, prepare to show form
          const { clientSecret, error } = await createUserSetupIntent(
            userId,
            vendorStripeAccountId
          );

          if (error || !clientSecret) {
            throw new Error(error || "Failed to initialize payment form");
          }

          setClientSecret(clientSecret);
          setStatus("form");
          setPaymentReady(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load payment information");
        setStatus("error");
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
      setError(err instanceof Error ? err.message : "An error occurred");
      setStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Render based on current status
  if (status === "loading" || isProcessing) {
    return <div className="h-12 w-full animate-pulse rounded-md bg-stone-100"></div>;
  }

  if (status === "error") {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (status === "card" && card) {
    return (
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="text-stone-500" />
          <p className="text-sm font-semibold">
            {card.brand.toUpperCase()} ••••{card.last4}
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
    );
  }

  if (status === "form" && clientSecret) {
    return (
      <CardSetupForm
        clientSecret={clientSecret}
        vendorStripeAccountId={vendorStripeAccountId}
        userId={userId}
        onSuccess={(newCard) => {
          setCard(newCard);
          setStatus("card");
          setPaymentReady(true);
        }}
        onError={(errorMessage) => {
          setError(errorMessage);
          setStatus("error");
        }}
      />
    );
  }

  return null;
}

interface CardSetupFormProps {
  clientSecret: string;
  vendorStripeAccountId: string;
  userId: string;
  onSuccess: (card: { brand: string; last4: string }) => void;
  onError: (errorMessage: string) => void;
}

function CardSetupForm({
  clientSecret,
  vendorStripeAccountId,
  userId,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError("Payment processing not available. Please try again.");
      return;
    }

    setIsSubmitting(true);

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
        throw new Error(error.message || "Payment setup failed");
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

        onSuccess(card);
      } else {
        throw new Error("Payment setup was not completed successfully");
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to set up payment method");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement options={{ layout: { type: "tabs" } }} />
      <Button type="submit" disabled={!stripe || !elements || isSubmitting} className="w-full">
        {isSubmitting ? "Processing..." : "Save card"}
      </Button>
    </form>
  );
}
