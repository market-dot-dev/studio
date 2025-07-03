import { SubscriptionStatus } from "@/app/generated/prisma";
import Stripe from "stripe";

export type PlanPricing = {
  pro: {
    monthly: string;
    yearly: string;
  };
};

export interface CachedPrice {
  id: string;
  amount: number;
  currency: string;
  interval?: string;
}

export interface PricingData {
  pro_monthly: CachedPrice;
  pro_annually: CachedPrice;
}

export interface SubscriptionInfo {
  isSubscriptionActive: boolean;
  isFree: boolean;
  isCustom: boolean;
  currentPlanName: string | null;
  statusText: string;
  statusType: "free" | "active" | "expired" | "inactive";
}

export function mapStripeStatusToSubscriptionStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  switch (status) {
    case "active":
      return SubscriptionStatus.ACTIVE;
    case "canceled":
      return SubscriptionStatus.CANCELED;
    case "incomplete":
      return SubscriptionStatus.INCOMPLETE;
    case "incomplete_expired":
      return SubscriptionStatus.INCOMPLETE_EXPIRED;
    case "past_due":
      return SubscriptionStatus.PAST_DUE;
    case "unpaid":
      return SubscriptionStatus.UNPAID;
    default:
      return SubscriptionStatus.CANCELED;
  }
}
