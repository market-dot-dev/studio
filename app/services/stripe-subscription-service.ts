"use server";

import { Tier } from "@prisma/client";
import Stripe from "stripe";
import { createStripeClient } from "./create-stripe-client";

/**
 * Create a subscription in Stripe
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param stripeCustomerId - The customer ID to subscribe
 * @param stripePriceId - The price ID for the subscription
 * @param trialDays - Optional number of trial days
 * @returns The created subscription
 */
export async function createStripeSubscription(
  stripeAccountId: string,
  stripeCustomerId: string,
  stripePriceId: string,
  trialDays: number = 0
): Promise<Stripe.Subscription> {
  const stripe = await createStripeClient(stripeAccountId);

  return await stripe.subscriptions.create(
    {
      customer: stripeCustomerId,
      items: [{ price: stripePriceId }],
      payment_behavior: "error_if_incomplete",
      expand: ["latest_invoice.payment_intent"],
      trial_period_days: trialDays
    },
    {
      idempotencyKey: `${stripeCustomerId}-${stripePriceId}`
    }
  );
}

/**
 * Update an existing subscription
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param subscriptionId - The subscription ID to update
 * @param priceId - The new price ID
 * @returns The updated subscription
 */
export async function updateSubscription(
  stripeAccountId: string,
  subscriptionId: string,
  priceId: string
): Promise<Stripe.Subscription> {
  const stripe = await createStripeClient(stripeAccountId);

  const subscription = await stripe.subscriptions.update(subscriptionId, {
    items: [{ price: priceId }],
    expand: ["latest_invoice.payment_intent"]
  });

  return subscription;
}

/**
 * Cancel a subscription
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param subscriptionId - The subscription ID to cancel
 * @returns The canceled subscription
 */
export async function cancelStripeSubscription(
  stripeAccountId: string,
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const stripe = await createStripeClient(stripeAccountId);
  return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Check if a customer is subscribed to a specific tier
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param stripeCustomerId - The customer ID to check
 * @param tier - The tier to check subscription status for
 * @returns True if the customer is subscribed
 */
export async function isSubscribedToStripeTier(
  stripeAccountId: string,
  stripeCustomerId: string,
  tier: Tier // @TODO: Perhaps we should call this a product?
): Promise<boolean> {
  return (
    (tier.stripePriceId
      ? await isSubscribedToPrice(stripeAccountId, stripeCustomerId, tier.stripePriceId)
      : false) ||
    (tier.stripePriceIdAnnual
      ? await isSubscribedToPrice(stripeAccountId, stripeCustomerId, tier.stripePriceIdAnnual)
      : false)
  );
}

/**
 * Check if a customer is subscribed to a specific price
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param stripeCustomerId - The customer ID to check
 * @param stripePriceId - The price ID to check subscription status for
 * @returns True if the customer is subscribed
 */
export async function isSubscribedToPrice(
  stripeAccountId: string,
  stripeCustomerId: string,
  stripePriceId: string
): Promise<boolean> {
  const stripe = await createStripeClient(stripeAccountId);

  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    price: stripePriceId,
    status: "active"
  });

  return subscriptions.data.length > 0;
}
