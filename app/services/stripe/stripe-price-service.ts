"use server";

import { GLOBAL_APPLICATION_FEE_DOLLARS, GLOBAL_APPLICATION_FEE_PCT } from "@/app/config/checkout";
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
 * Calculates the application fee amount based on price and fee settings
 *
 * @param price - The base price amount
 * @param applicationFeePercent - Optional percentage fee to apply (added to global fee)
 * @param applicationFeePrice - Optional fixed fee amount to apply (added to global fee)
 * @returns The calculated application fee amount
 */
export async function calculateApplicationFee(
  price: number,
  applicationFeePercent: number = 0,
  applicationFeePrice: number = 0
): Promise<number> {
  const totalPercent = (applicationFeePercent + (GLOBAL_APPLICATION_FEE_PCT || 0)) / 100;
  const totalFee = applicationFeePrice + (GLOBAL_APPLICATION_FEE_DOLLARS || 0);

  return Math.round(price * totalPercent) + totalFee;
}
