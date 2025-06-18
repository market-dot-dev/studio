"use server";

import { PricingData } from "@/types/platform";
import { createStripeClient } from "../stripe/create-stripe-client";

// Simple in-memory cache
let pricingCache: PricingData | null = null;
let lastFetch = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function fetchPricingFromStripe(): Promise<PricingData> {
  const stripe = await createStripeClient();

  // Fetch all active prices and filter by lookup keys
  const prices = await stripe.prices.list({
    active: true,
    expand: ["data.product"]
  });

  // Transform to our format, filtering by lookup keys for PRO plan only
  const pricingData: Partial<PricingData> = {};

  for (const price of prices.data) {
    if (!price.lookup_key || !price.unit_amount) continue;

    // Type-safe lookup key checking - only PRO plan pricing
    if (price.lookup_key === "pro_monthly") {
      pricingData.pro_monthly = {
        id: price.id,
        amount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval
      };
    } else if (price.lookup_key === "pro_annually") {
      pricingData.pro_annually = {
        id: price.id,
        amount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval
      };
    }
  }

  // Validate we got all expected PRO prices
  const missing: string[] = [];
  if (!pricingData.pro_monthly) missing.push("pro_monthly");
  if (!pricingData.pro_annually) missing.push("pro_annually");

  if (missing.length > 0) {
    throw new Error(`Missing prices for lookup keys: ${missing.join(", ")}`);
  }

  return pricingData as PricingData;
}

/**
 * Get pricing data with caching
 */
export async function getCachedPricing(): Promise<PricingData> {
  const now = Date.now();

  if (!pricingCache || now - lastFetch > CACHE_TTL) {
    console.log("Fetching fresh pricing data from Stripe");
    pricingCache = await fetchPricingFromStripe();
    lastFetch = now;
  }

  return pricingCache;
}

/**
 * Clear the pricing cache (useful for webhooks)
 */
export async function clearPricingCache() {
  pricingCache = null;
  lastFetch = 0;
}
