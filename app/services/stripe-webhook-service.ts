"use server";

import prisma from "@/lib/prisma";
import { ErrorMessageCode } from "@/types/stripe";
import Stripe from "stripe";
import { checkVendorStripeStatusById } from "./stripe-vendor-service";
import {
  handleCancelledSubscriptionFromWebhook,
  updateSubscriptionFromWebhook
} from "./stripe-webhook-helpers";

/**
 * Handles Stripe account events
 * @param event - The Stripe event object
 */
export async function handleAccountEvent(event: Stripe.Event) {
  const accountEvent = event.data.object as Stripe.Account;
  const accountId = event.account;

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

/**
 * Handles Stripe subscription events
 * @param event - The Stripe event object
 */
export async function handleSubscriptionEvent(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const accountId = event.account; // Connect account ID

  console.log(
    `Processing ${event.type} for subscription ${subscription.id} from account ${accountId || "platform"}`
  );
  const subItem = subscription.items.data[0];
  const activeUntil = subItem.current_period_end
    ? new Date(subItem.current_period_end * 1000)
    : null;

  if (event.type === "customer.subscription.deleted" || subscription.status === "canceled") {
    await handleCancelledSubscriptionFromWebhook(subscription.id, activeUntil);
  } else if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.created"
  ) {
    // For "created" events, this will only work if we already have the subscription in our database
    // which should be the case for subscriptions created through our platform
    await updateSubscriptionFromWebhook(subscription.id, subscription.status, activeUntil);
  }
}
