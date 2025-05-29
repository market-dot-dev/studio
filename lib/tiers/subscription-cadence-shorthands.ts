import type { SubscriptionCadence } from "@/app/services/stripe/stripe-price-service";

export const subscriptionCadenceShorthands: Record<SubscriptionCadence, string | null> = {
  month: "mo",
  year: "yr",
  quarter: "3 mo",
  once: null
};
