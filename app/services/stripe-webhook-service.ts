"use server";

import prisma from "@/lib/prisma";
import { ErrorMessageCode } from "@/types/stripe";
import Stripe from "stripe";
import { checkVendorStripeStatusById } from "./stripe-vendor-service";

/**
 * Unified handler for Stripe account events
 * @param eventType - The type of Stripe event
 * @param account - The Stripe account object from the event
 */
export async function handleAccountEvent(eventType: string, account: Stripe.Account) {
  const user = await prisma.user.findUnique({
    where: { stripeAccountId: account.id }
  });

  if (!user) {
    console.error(`No user found with Stripe account ID: ${account.id}`);
    return;
  }

  if (eventType === "account.updated") {
    // Only run status check if charges_enabled or payouts_enabled have changed
    // This avoids unnecessary updates for non-critical account changes
    if (user.stripeAccountDisabled !== !account.charges_enabled) {
      // Use the existing helper function to check account status
      await checkVendorStripeStatusById(user.id, true);

      console.log(`Updated account status for user ${user.id}, stripeAccountId: ${account.id}`);
    }
  } else if (eventType === "account.application.deauthorized") {
    // Disconnect the Stripe account
    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeAccountId: null,
        stripeAccountDisabled: true,
        stripeAccountDisabledReason: JSON.stringify([ErrorMessageCode.StripeAccountDisconnected])
      }
    });

    console.log(`Disconnected Stripe account for user ${user.id}`);
  }
}

// Additional event handlers to be implemented
// export async function handleSubscriptionEvent(eventType: string, subscription: Stripe.Subscription) {...}
// export async function handleChargeEvent(eventType: string, charge: Stripe.Charge) {...}
// export async function handleInvoiceEvent(eventType: string, invoice: Stripe.Invoice) {...}
