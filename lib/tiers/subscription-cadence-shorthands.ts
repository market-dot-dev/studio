import type { SubscriptionCadence } from "@/app/services/StripeService";

export const subscriptionCadenceShorthands: Record<SubscriptionCadence, string | null> = {
  month: "mo",
  year: "yr",
  quarter: "3 mo",
  once: null
};
