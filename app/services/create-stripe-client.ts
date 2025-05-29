"use server";

import Stripe from "stripe";

/**
 * Creates a Stripe client with the specified account ID
 * @param stripeAccountId - Optional Stripe Connect account ID
 * @returns Stripe client instance
 */
export async function createStripeClient(stripeAccountId?: string): Promise<Stripe> {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }

  const options: Stripe.StripeConfig = {
    apiVersion: "2025-04-30.basil"
  };

  if (stripeAccountId) {
    options.stripeAccount = stripeAccountId;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, options);
}
