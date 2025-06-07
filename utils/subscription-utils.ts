import { OrganizationBilling } from "@/app/generated/prisma";
import { SubscriptionInfo } from "@/types/platform";

export function getSubscriptionInfo(billing: OrganizationBilling | null): SubscriptionInfo {
  const now = new Date();
  const trialEnd = billing?.trialEndAt ? new Date(billing.trialEndAt) : null;

  // Handle trial status with explicit boolean checks
  const isTrialActive: boolean = Boolean(
    billing?.subscriptionStatus === "FREE_TRIAL" && trialEnd && trialEnd > now
  );

  const isTrialExpired: boolean = Boolean(
    billing?.subscriptionStatus === "FREE_TRIAL" && trialEnd && trialEnd <= now
  );

  const isSubscriptionActive: boolean = billing?.subscriptionStatus === "ACTIVE";

  // Ensure daysLeft is always a number
  const daysLeft: number = trialEnd
    ? Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Determine the current plan name
  let currentPlanName: string | null = null;

  if (isSubscriptionActive && billing?.planName) {
    currentPlanName = billing.planName.toLowerCase();
  } else if (isTrialActive) {
    currentPlanName = "trial";
  }

  // Determine status text and type for UI
  let statusText: string;
  let statusType: "trial" | "active" | "expired" | "inactive";

  if (isSubscriptionActive) {
    statusText = "Active";
    statusType = "active";
  } else if (isTrialActive) {
    statusText = "Trial";
    statusType = "trial";
  } else if (isTrialExpired) {
    statusText = "Trial expired";
    statusType = "expired";
  } else {
    statusText = "Inactive";
    statusType = "inactive";
  }

  return {
    isTrialActive,
    isTrialExpired,
    isSubscriptionActive,
    daysLeft,
    trialEnd,
    currentPlanName,
    statusText,
    statusType
  };
}

// Helper function to format plan names consistently
export function formatPlanName(planName: string): string {
  // Remove any special characters and convert to lowercase
  const normalizedName = planName.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Map of possible variations to standardized names
  const planNameMap: Record<string, string> = {
    basic: "basic",
    basicplan: "basic",
    basicsubscription: "basic",
    pro: "pro",
    proplan: "pro",
    prosubscription: "pro"
  };

  return planNameMap[normalizedName] || normalizedName;
}

// Helper to check if a plan exists
export function isValidPlanName(planName: string): boolean {
  const validPlans = ["basic", "pro"] as const;
  return validPlans.includes(formatPlanName(planName) as (typeof validPlans)[number]);
}

// Helper to get plan display name
export function getPlanDisplayName(planName: string | null): string {
  if (!planName) return "No plan";

  const formattedName = formatPlanName(planName);
  const displayNames: Record<string, string> = {
    basic: "Basic plan",
    pro: "Pro plan",
    trial: "Free trial"
  };

  return displayNames[formattedName] || "Custom plan";
}
