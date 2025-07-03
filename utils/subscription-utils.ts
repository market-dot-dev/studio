import { OrganizationBilling, PlanType } from "@/app/generated/prisma";
import { SubscriptionInfo } from "@/types/platform";

export function getSubscriptionInfo(billing: OrganizationBilling | null): SubscriptionInfo {
  // Default to FREE plan if no billing record
  const planType = billing?.planType || PlanType.FREE;

  // Determine if subscription is active (only for PRO plans)
  const isSubscriptionActive: boolean =
    planType === PlanType.PRO && billing?.subscriptionStatus === "ACTIVE";

  // Determine if on free plan
  const isFree: boolean = planType === PlanType.FREE;

  // Determine if on custom plan
  const isCustom: boolean = planType === PlanType.CUSTOM;

  // Convert plan type to display name
  const currentPlanName = getPlanDisplayName(planType);

  // Determine status text and type for UI
  let statusText: string;
  let statusType: "free" | "active" | "expired" | "inactive";

  if (planType === PlanType.FREE) {
    statusText = "Free";
    statusType = "free";
  } else if (planType === PlanType.CUSTOM) {
    statusText = "Active";
    statusType = "active"; // Custom plans are considered active
  } else if (isSubscriptionActive) {
    statusText = "Active";
    statusType = "active";
  } else {
    // PRO plan but subscription not active
    statusText = "Inactive";
    statusType = "inactive";
  }

  return {
    isSubscriptionActive,
    isFree,
    isCustom,
    currentPlanName,
    statusText,
    statusType
  };
}

// Helper to check if a plan type is valid
export function isValidPlanType(planType: PlanType): boolean {
  return Object.values(PlanType).includes(planType);
}

// Helper to get plan display name from PlanType enum
export function getPlanDisplayName(planType: PlanType): string {
  const displayNames: Record<PlanType, string> = {
    [PlanType.FREE]: "free",
    [PlanType.PRO]: "pro",
    [PlanType.CUSTOM]: "custom"
  };

  return displayNames[planType];
}

// Helper to get plan display label for UI
export function getPlanDisplayLabel(planType: PlanType): string {
  const displayLabels: Record<PlanType, string> = {
    [PlanType.FREE]: "Free",
    [PlanType.PRO]: "Pro",
    [PlanType.CUSTOM]: "Custom"
  };

  return displayLabels[planType];
}

// Helper to check if plan has Stripe integration
export function hasStripeIntegration(planType: PlanType): boolean {
  return planType === PlanType.PRO;
}

// Helper to check if plan is paid
export function isPaidPlan(planType: PlanType): boolean {
  return planType === PlanType.PRO || planType === PlanType.CUSTOM;
}

/**
 * Helper to check if user has an active pro subscription
 * @param subscriptionInfo - The subscription info object (can be null/undefined)
 * @returns true if user has an active, non-free subscription
 */
export function hasActiveProSubscription(subscriptionInfo?: SubscriptionInfo | null): boolean {
  return Boolean(
    subscriptionInfo && !subscriptionInfo.isFree && subscriptionInfo.isSubscriptionActive
  );
}
