import {
  useStripe,
  useElements,
  CardElement,
  Elements,
} from "@stripe/react-stripe-js";
import { useState, useCallback, ReactElement, ReactNode } from "react";
import { SetupIntent, loadStripe } from "@stripe/stripe-js";
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
  handleConfirm: (ev: React.FormEvent<HTMLFormElement>) => void;
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

  const handleConfirm = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const promiseStripe = await stripePromise;
    if (!clientSecret) {
      console.error("Client secret not found");
      return;
    }
    if (!promiseStripe) {
      console.error("Stripe not loaded");
      return;
    }

    return promiseStripe
      .confirmUsBankAccountSetup(clientSecret)
      .then(
        ({
          setupIntent,
          error,
        }: {
          setupIntent?: SetupIntent;
          error?: any;
        }) => {
          if (error) {
            console.error(`[ach:confirm] ${error.message}`, setupIntent);
            return;
            // The payment failed for some reason.
          }
          if (!setupIntent) {
            console.error("[ach:confirm] No setupIntent", setupIntent);
            return;
          } else if (setupIntent.status === "requires_payment_method") {
            // Confirmation failed. Attempt again with a different payment method.
            console.error("[ach:confirm] Requires payment method", setupIntent);
          } else if (setupIntent.status === "succeeded") {
            // Confirmation succeeded! The account is now saved.
            // Display a message to customer.
            console.log("[ach:confirm] Success", setupIntent);

            if(!setupIntent?.payment_method) {
              console.error("[ach:confirm] Success, but no payment method found", setupIntent);
              throw new Error("Succes, but no payment method found");
            }

            attachPaymentMethod(setupIntent.payment_method as string, maintainerUserId, maintainerStripeAccountId).then(() => {
              console.log("Payment method attached");
            }).catch((error) => {
              console.error("Failed to attach payment method", error);
            });
          } else if (
            setupIntent.next_action?.type === "verify_with_microdeposits"
          ) {
            console.error("[ach:confirm] Requires verification with microdeposits", setupIntent);
            // The account needs to be verified via microdeposits.
            // Display a message to consumer with next steps (consumer waits for
            // microdeposits, then enters a statement descriptor code on a page sent to them via email).
          }
        },
      );
  };

  const handleSubmit = useCallback(
    async (
      event?: React.FormEvent<HTMLFormElement>,
    ): Promise<IntentReturn> => {
      event?.preventDefault();

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

      const accountHolderNameField = document.getElementById(
        "account-holder-name",
      ) as HTMLInputElement;
      const accountHolderEmailField = document.getElementById(
        "account-holder-email",
      ) as HTMLInputElement;

      if (!accountHolderNameField || !accountHolderEmailField) {
        return Promise.reject("Account fields not found");
      }

      return (await stripePromise)
        ?.collectBankAccountForSetup({
          clientSecret,
          params: {
            payment_method_type: "us_bank_account",
            payment_method_data: {
              billing_details: {
                name: accountHolderNameField.value,
                email: accountHolderEmailField.value,
              },
            },
          },
          expand: ["payment_method"],
        })
        .then(({ setupIntent, error }) => {
          if (error) {
            console.error(error.message);
            // PaymentMethod collection failed for some reason.
            return Promise.reject(error.message);
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

            //confirmationForm.show();
            console.log("Requires confirmation", setupIntent);
            return setupIntent?.status;
          } else if (setupIntent.status === "requires_action") {
            // We collected an account - possibly instantly verified, but possibly
            // manually-entered. Display payment method details and mandate text
            // to the customer and confirm the intent once they accept
            // the mandate.

            //confirmationForm.show();
            console.log("Requires action", setupIntent);
            return setupIntent?.status;
          } else if (setupIntent.status === "succeeded") {
            // The setup has succeeded. Send the customer a confirmation email.
            return setupIntent.status;
          } else {
            console.error(
              "Unexpected setupIntent status: ",
              setupIntent.status,
            );
            throw new Error("Unexpected setupIntent status");
          }
        });
    },
    [stripe, setError, maintainerUserId, maintainerStripeAccountId, user],
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
