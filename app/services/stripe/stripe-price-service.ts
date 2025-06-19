"use server";

import { DEFAULT_PLATFORM_FEE_PERCENT } from "@/app/config/checkout";
import { PlanType } from "@/app/generated/prisma";
import Stripe from "stripe";
import { createStripeClient } from "./create-stripe-client";

export type SubscriptionCadence = "month" | "year" | "quarter" | "once";

/**
 * Creates a new price in Stripe
 *
 * @param stripeAccountId - The Stripe account ID
 * @param stripeProductId - The Stripe product ID to attach the price to
 * @param price - The price amount (in dollars, not cents)
 * @param cadence - The billing cadence for recurring prices (month, year, quarter, once)
 * @returns The created Stripe price
 */
export async function createStripePrice(
  stripeAccountId: string,
  stripeProductId: string,
  price: number,
  cadence: SubscriptionCadence = "month"
): Promise<Stripe.Price> {
  const stripe = await createStripeClient(stripeAccountId);

  const attrs: any = {
    unit_amount: price * 100, // Stripe requires the price in cents
    currency: "usd",
    product: stripeProductId
  };

  if (cadence === "quarter") {
    attrs["recurring"] = {
      interval: "month",
      interval_count: 3
    };
  } else if (cadence !== "once") {
    attrs["recurring"] = {
      interval: cadence
    };
  }

  return await stripe.prices.create(attrs);
}

/**
 * Deactivates a price in Stripe (prices cannot be deleted, only deactivated)
 *
 * @param stripeAccountId - The Stripe account ID
 * @param stripePriceId - The Stripe price ID to deactivate
 * @returns The updated Stripe price
 */
export async function deactivateStripePrice(
  stripeAccountId: string,
  stripePriceId: string
): Promise<Stripe.Price> {
  const stripe = await createStripeClient(stripeAccountId);
  return await stripe.prices.update(stripePriceId, { active: false });
}

/**
 * Calculates the platform fee based on vendor organization's plan type
 *
 * @param price - The base price amount (in dollars)
 * @param planType - The vendor organization's plan type
 * @returns The calculated platform fee amount (in cents for Stripe)
 */
export async function calculatePlatformFee(
  price: number,
  planType: PlanType | null
): Promise<number> {
  // Only apply platform fee for FREE plan organizations
  if (!planType || planType === PlanType.FREE) {
    const feePercent = parseFloat(
      process.env.PLATFORM_FEE_PERCENT || DEFAULT_PLATFORM_FEE_PERCENT.toString()
    );
    return Math.round(price * 100 * (feePercent / 100)); // Convert to cents
  }

  // No platform fee for PRO/CUSTOM plans
  return 0;
}
