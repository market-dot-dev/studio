import { SubscriptionInfo } from "@/types/platform";
import { hasActiveProSubscription } from "@/utils/subscription-utils";

export interface PlanConfig {
  id: "free" | "pro" | "custom";
  title: string;
  description: string;
  transactionFee: string;
  isCurrentPlan: boolean;
  buttonLabel: string;
  buttonDisabled: boolean;
  showCustomFeatures?: boolean;
}

export type PlanConfigurationContext = "billing" | "onboarding" | "marketing";

interface PlanConfigurationOptions {
  subscriptionInfo?: SubscriptionInfo;
  includeCustomPlan?: boolean;
  context?: PlanConfigurationContext;
}

export function createPlanConfiguration(options: PlanConfigurationOptions): PlanConfig[] {
  const { subscriptionInfo, includeCustomPlan = true, context = "billing" } = options;

  const currentPlanType = getCurrentPlanType(subscriptionInfo);

  const plans: PlanConfig[] = [
    {
      id: "free",
      title: "Free",
      description: "Only pay when you get paid",
      transactionFee: "$0.25 transaction fee + 1% per sale",
      isCurrentPlan: currentPlanType === "free",
      buttonLabel: getFreePlanButtonLabel(subscriptionInfo, context),
      buttonDisabled: getFreePlanButtonDisabled(subscriptionInfo, context)
    },
    {
      id: "pro",
      title: "Pro",
      description: "Reliable pricing for growing businesses",
      transactionFee: "$0.25 transaction fee (no commission fee)",
      isCurrentPlan: currentPlanType === "pro",
      buttonLabel: getProPlanButtonLabel(subscriptionInfo, context),
      buttonDisabled: getProPlanButtonDisabled(subscriptionInfo, context)
    }
  ];

  if (includeCustomPlan) {
    plans.push({
      id: "custom",
      title: "Custom",
      description: "For businesses at any scale",
      transactionFee: "Custom pricing for your business",
      isCurrentPlan: currentPlanType === "custom",
      buttonLabel: getCustomPlanButtonLabel(subscriptionInfo, context),
      buttonDisabled: getCustomPlanButtonDisabled(subscriptionInfo, context),
      showCustomFeatures: true
    });
  }

  return plans;
}

// Helper functions for business logic
function getCurrentPlanType(subscriptionInfo?: SubscriptionInfo): "free" | "pro" | "custom" {
  if (hasActiveProSubscription(subscriptionInfo)) return "pro";
  if (subscriptionInfo?.isCustom) return "custom";
  return "free";
}

function getFreePlanButtonLabel(
  subscriptionInfo?: SubscriptionInfo,
  context?: PlanConfigurationContext
): string {
  if (context === "onboarding") {
    return "Continue with Free";
  }

  if (context === "marketing") {
    return "Get started with Free";
  }

  if (subscriptionInfo?.isCustom) return "Contact support to change plan";
  if (subscriptionInfo?.isFree) return "Current Plan";
  return "Downgrade to Free";
}

function getFreePlanButtonDisabled(
  subscriptionInfo?: SubscriptionInfo,
  context?: PlanConfigurationContext
): boolean {
  // In onboarding and marketing, always allow users to continue with free
  if (context === "onboarding" || context === "marketing") {
    return false;
  }

  // In billing settings, disable if already on free or custom plan
  return subscriptionInfo?.isFree === true || subscriptionInfo?.isCustom === true;
}

function getProPlanButtonLabel(
  subscriptionInfo?: SubscriptionInfo,
  context?: PlanConfigurationContext
): string {
  if (context === "onboarding") {
    return !subscriptionInfo || subscriptionInfo.isFree
      ? "Upgrade to Pro"
      : subscriptionInfo.isSubscriptionActive
        ? "Current Plan"
        : "Reactivate Pro";
  }

  if (context === "marketing") {
    return "Get started with Pro";
  }

  if (subscriptionInfo?.isCustom) return "Contact support to change plan";
  if (!subscriptionInfo || subscriptionInfo.isFree) return "Upgrade to Pro";
  return "Current Plan";
}

function getProPlanButtonDisabled(
  subscriptionInfo?: SubscriptionInfo,
  context?: PlanConfigurationContext
): boolean {
  if (context === "marketing") return false;
  if (subscriptionInfo?.isCustom) return true;
  if (hasActiveProSubscription(subscriptionInfo)) return true;
  return false;
}

function getCustomPlanButtonLabel(
  subscriptionInfo?: SubscriptionInfo,
  context?: PlanConfigurationContext
): string {
  if (context === "marketing") return "Get in touch";
  if (subscriptionInfo?.isCustom) return "Current Plan";
  return "Get in touch";
}

function getCustomPlanButtonDisabled(
  subscriptionInfo?: SubscriptionInfo,
  context?: PlanConfigurationContext
): boolean {
  if (context === "marketing") return false;
  return subscriptionInfo?.isCustom === true;
}
