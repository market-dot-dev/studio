import { SubscriptionStatus } from "@/app/generated/prisma";
import Stripe from "stripe";

export type PlanPricing = {
  basic: {
    monthly: string;
    yearly: string;
  };
  pro: {
    monthly: string;
    yearly: string;
  };
};

export interface SubscriptionInfo {
  isTrialActive: boolean;
  isTrialExpired: boolean;
  isSubscriptionActive: boolean;
  daysLeft: number;
  trialEnd: Date | null;
  currentPlanName: string | null;
  statusText: string;
  statusType: "trial" | "active" | "expired" | "inactive";
}

export function mapStripeStatusToSubscriptionStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return SubscriptionStatus.TRIALING;
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
      return SubscriptionStatus.EXPIRED;
  }
}
