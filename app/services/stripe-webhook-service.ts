"use server";

import { SubscriptionStates } from "@/app/models/Subscription";
import prisma from "@/lib/prisma";
import { ErrorMessageCode } from "@/types/stripe";
import Stripe from "stripe";
import { checkVendorStripeStatusById } from "./stripe-vendor-service";
import { cancelSubscription, updateSubscription } from "./SubscriptionService";

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

  // Find subscription in database
  const localSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
    include: { tier: true }
  });

  // For existing subscriptions
  if (localSubscription) {
    if (event.type === "customer.subscription.deleted" || subscription.status === "canceled") {
      // Use cancelSubscription service which handles emails too
      await cancelSubscription(localSubscription.id);
      console.log(`Cancelled subscription ${localSubscription.id}`);
    } else if (event.type === "customer.subscription.updated") {
      // Map Stripe status to our state
      const state = mapStripeStatusToState(subscription.status);
      const subItem = subscription.items.data[0];
      // Use updateSubscription service
      await updateSubscription(localSubscription.id, {
        state,
        activeUntil: subItem.current_period_end ? new Date(subItem.current_period_end * 1000) : null
      });

      console.log(`Updated subscription ${localSubscription.id} to state: ${state}`);
    }
  }
  // For new subscriptions created outside our platform
  else if (event.type === "customer.subscription.created") {
    // Track these but don't try to recreate them - simply log for now
    // With Connect platforms, it's difficult to reliably map external subscriptions
    // to our internal structure without custom metadata
    console.log(
      `New external subscription detected: ${subscription.id}. ` +
        `Consider adding metadata to Stripe subscriptions to facilitate synchronization.`
    );
  }
}

/**
 * Maps Stripe subscription status to our internal state
 */
function mapStripeStatusToState(status: string): string {
  switch (status) {
    case "active":
    case "trialing":
      return SubscriptionStates.renewing;
    default:
      return SubscriptionStates.cancelled;
  }
}
