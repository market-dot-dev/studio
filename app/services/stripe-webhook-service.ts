"use server";

import prisma from "@/lib/prisma";
import { ErrorMessageCode } from "@/types/stripe";
import Stripe from "stripe";
import { checkVendorStripeStatusById } from "./stripe-vendor-service";


/**
 * Handles Stripe account events
 * @param event - The Stripe event object
 */
export async function handleAccountEvent(event: Stripe.Event) {
  const account = event.data.object as Stripe.Account;
  // Get account ID either from the object or the event
  const accountId = account.id || event.account;

  const user = await prisma.user.findUnique({
    where: { stripeAccountId: accountId }
  });

  if (!user) {
    console.error(`No user found with Stripe account ID: ${accountId}`);
    return;
  }

  if (event.type === "account.updated") {
      await checkVendorStripeStatusById(user.id, true);
    console.log(`Updated account status for user ${user.id}`);
  } else if (event.type === "account.application.deauthorized") {
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
