import { useState, useCallback } from "react";
import { SetupIntent, SetupIntentResult, StripeError, loadStripe } from "@stripe/stripe-js";
import { User } from "@prisma/client";
import { SessionUser } from "../models/Session";
import {
  attachPaymentMethod,
  detachPaymentMethod,
  getSetupIntent,
} from "../services/StripeService";

export type IntentReturn = string | null | void | undefined;

interface UseStripePaymentCollectorProps {
  user: User | SessionUser | null | undefined;
  setError: (error: string | null) => void;
  maintainerUserId: string;
  maintainerStripeAccountId: string;
}

interface UseStripePaymentCollectorReturns {
  stripeCustomerId: string | null;
  handleSubmit: (
    event?: React.FormEvent<HTMLFormElement>,
  ) => Promise<IntentReturn>;
  handleConfirm: () => Promise<{ setupIntent: SetupIntent; error?: undefined; } | { setupIntent?: undefined; error: StripeError; } | undefined>;
  handleDetach: () => Promise<void>;
}

const useStripeAchCollector = ({
  user,
  setError,
  maintainerUserId,
  maintainerStripeAccountId,
}: UseStripePaymentCollectorProps): UseStripePaymentCollectorReturns => {
  const pk =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_NOT_SET_IN_ENV";
  const stripe = require("stripe")(pk, {
    stripeAccount: maintainerStripeAccountId,
  });

  const stripePromise = loadStripe(pk, {
    stripeAccount: maintainerStripeAccountId,
  }).catch((err) => {
    console.error("Failed to load stripe", err);
    return null;
  });

  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleConfirm = async (): Promise<{ setupIntent: SetupIntent; error?: undefined; } | { setupIntent?: undefined; error: StripeError; } | undefined> => {
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw "Stripe not loaded";
    }

    if (!clientSecret) {
      throw "Client secret not found";
    }

    return stripe
      .confirmUsBankAccountSetup(clientSecret)
      .then(
        ({
          setupIntent,
          error,
        }: {
          setupIntent?: SetupIntent;
          error?: any;
        }) => {
          const handleError = (error: any = null, logText: string = '') => {
            const msg = [error?.message, logText].filter(Boolean).join(' ');
            console.error(`[ach:confirm] ${msg}`);
            setError(`${msg}`);
            return Promise.reject(error.message);
          }

          if (error) {
            return handleError(error);
          }
          if (!setupIntent) {
            return handleError(null, 'No setupIntent');
          } else if (setupIntent.status === "requires_payment_method") {
            return handleError(null, 'User cancelled dialogue (requires_payment_method)');
          } else if (setupIntent.status === "succeeded") {
            console.log("[ach:confirm] Success", setupIntent);

            if(!setupIntent?.payment_method) {
              return handleError(null, 'Success, but no payment method found');
            }

            attachPaymentMethod(setupIntent.payment_method as string, maintainerUserId, maintainerStripeAccountId).then(() => {
              console.log("Payment method attached");
            }).catch((error) => {
              return handleError(error, 'Error attaching payment method');
            });
          } else if (
            setupIntent.next_action?.type === "verify_with_microdeposits"
          ) {
            return handleError(null, 'Bank account requires microdeposit verification, NYI');
          }
        },
      );
  };

  const handleSubmit = useCallback(
    async (
      event?: React.FormEvent<HTMLFormElement>,
    ): Promise<IntentReturn> => {
      event?.preventDefault();
      const stripe = await stripePromise;

      if (!stripe) {
        return Promise.reject("Stripe not loaded");
      }

      if (!user) {
        return Promise.reject("User not found");
      }

      const clientSecret = await getSetupIntent(user.id, maintainerUserId);

      if (!clientSecret) {
        return Promise.reject("Setup intent did not attach a client secret");
      }
      
      setClientSecret(clientSecret);

      if (!user.name || !user.email) {
        return Promise.reject("User is missing either name or email.");
      }

      return stripe.collectBankAccountForSetup({
          clientSecret,
          params: {
            payment_method_type: "us_bank_account",
            payment_method_data: {
              billing_details: {
                name: user.name,
                email: user.email,
              },
            },
          },
          expand: ["payment_method"],
        })
        .then(({ setupIntent, error }) => {
          if (error) {
            console.error(error.message);
            // PaymentMethod collection failed for some reason.
            throw error?.message;
          } else if (setupIntent.status === "requires_payment_method") {
            // Customer canceled the hosted verification modal. Present them with other
            // payment method type options.
            console.log("Requires payment method", setupIntent);
            return setupIntent?.status;
          } else if (setupIntent.status === "requires_confirmation") {
            // We collected an account - possibly instantly verified, but possibly
            // manually-entered. Display payment method details and mandate text
            // to the customer and confirm the intent once they accept
            // the mandate.
            console.log("Requires confirmation", setupIntent);
            return setupIntent?.status;
          } else if (setupIntent.status === "requires_action") {
            // We collected an account - possibly instantly verified, but possibly
            // manually-entered. Display payment method details and mandate text
            // to the customer and confirm the intent once they accept
            // the mandate.
            console.log("Requires action", setupIntent);
            return setupIntent?.status;
          } else if (setupIntent.status === "succeeded") {
            return setupIntent.status;
          } else {
            console.error(
              "Unexpected setupIntent status: ",
              setupIntent.status,
            );
            return Promise.reject("Unexpected setupIntent status");
          }
        });
    },
    [stripePromise, user, maintainerUserId],
  );

  const handleDetach = useCallback(async () => {
    if (!user || !maintainerUserId) {
      return;
    }
    await detachPaymentMethod(maintainerUserId, maintainerStripeAccountId);
  }, [user, maintainerUserId, maintainerStripeAccountId]);

  return {
    stripeCustomerId,
    handleSubmit,
    handleConfirm,
    handleDetach,
  };
};

export default useStripeAchCollector;
