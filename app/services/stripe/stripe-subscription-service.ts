"use server";

import { DEFAULT_PLATFORM_FEE_PERCENT } from "@/app/config/checkout";
import { PlanType, Tier } from "@/app/generated/prisma";
import { generateId } from "@/lib/utils";
import Stripe from "stripe";
import { createStripeClient } from "./create-stripe-client";
import { calculatePlatformFee } from "./stripe-price-service";

/**
 * Create a subscription in Stripe
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param stripeCustomerId - The customer ID to subscribe
 * @param stripePriceId - The price ID for the subscription
 * @param price - The subscription price (in dollars) for fee calculation
 * @param trialDays - Optional number of trial days
 * @param vendorPlanType - The vendor organization's plan type for fee calculation
 * @returns Object with the created subscription and applied platform fee amount
 */
export async function createStripeSubscriptionForCustomer(
  stripeAccountId: string,
  stripeCustomerId: string,
  stripePriceId: string,
  price: number,
  trialDays: number = 0,
  vendorPlanType: PlanType | null = null
): Promise<{ subscription: Stripe.Subscription; platformFeeAmount: number }> {
  const stripe = await createStripeClient(stripeAccountId);

  // Generate a unique identifier for idempotency
  const idempotencyKey = `${stripeCustomerId}-${stripePriceId}-${generateId()}`;

  // Calculate platform fee percentage and amount
  const platformFeePercent =
    !vendorPlanType || vendorPlanType === PlanType.FREE
      ? parseFloat(process.env.PLATFORM_FEE_PERCENT || DEFAULT_PLATFORM_FEE_PERCENT.toString())
      : 0;

  const platformFeeAmount = await calculatePlatformFee(price, vendorPlanType);

  const subscriptionData: Stripe.SubscriptionCreateParams = {
    customer: stripeCustomerId,
    items: [{ price: stripePriceId }],
    payment_behavior: "error_if_incomplete",
    trial_period_days: trialDays,
    expand: ["latest_invoice"]
  };

  // Apply platform fee for FREE plan vendors
  if (platformFeePercent > 0) {
    subscriptionData.application_fee_percent = platformFeePercent;
  }

  const subscription = await stripe.subscriptions.create(subscriptionData, {
    idempotencyKey: idempotencyKey
  });

  return {
    subscription,
    platformFeeAmount
  };
}

/**
 * Update an existing subscription
 *
 * @param vendorAccountId - The vendor's Stripe account ID
 * @param subscriptionId - The subscription ID to update
 * @param priceId - The new price ID
 * @returns The updated subscription
 */
export async function updateSubscriptionPrice(
  vendorAccountId: string,
  subscriptionId: string,
  priceId: string
): Promise<Stripe.Subscription> {
  const stripe = await createStripeClient(vendorAccountId);

  const subscription = await stripe.subscriptions.update(subscriptionId, {
    items: [{ price: priceId }],
    expand: ["latest_invoice"]
  });

  return subscription;
}

/**
 * Schedule a subscription to not renew at the end of the current billing period
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param subscriptionId - The subscription ID to cancel
 * @param immediateCancel - Whether to cancel immediately (defaults to false)
 * @returns The updated subscription
 */
export async function cancelStripeSubscription(
  stripeAccountId: string,
  subscriptionId: string,
  immediateCancel: boolean = false
): Promise<Stripe.Subscription> {
  const stripe = await createStripeClient(stripeAccountId);

  if (immediateCancel) {
    // Immediately cancel the subscription
    return await stripe.subscriptions.cancel(subscriptionId);
  } else {
    // Set the subscription to cancel at the end of the current period
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
      expand: ["latest_invoice"]
    });
  }
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

/**
 * Reactivate a cancelled Stripe subscription
 *
 * This function is used when a user wants to reactivate a subscription that has been
 * cancelled but is still within its active period. It removes the cancellation
 * schedule, effectively making the subscription renew again at the period end.
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param subscriptionId - The ID of the cancelled subscription to reactivate
 * @returns The updated subscription with cancellation removed
 */
export async function reactivateStripeSubscription(
  stripeAccountId: string,
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const stripe = await createStripeClient(stripeAccountId);

  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false
  });

  return subscription;
}
