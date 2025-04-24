"use server";

import Stripe from "stripe";

/**
 * Creates a Stripe client with the specified account ID
 * @param stripeAccountId - Optional Stripe Connect account ID
 * @returns Stripe client instance
 */
export function createStripeClient(stripeAccountId?: string): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }

  const options: Stripe.StripeConfig = {};

  if (stripeAccountId) {
    options.stripeAccount = stripeAccountId;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, options);
}

/**
 * Get a Stripe client for the Stripe platform account (not connected to any specific merchant)
 */
export function getPlatformStripeClient(): Stripe {
  return createStripeClient();
}
