import { PlanInformation } from "@/app/app/(dashboard)/settings/billing/plan-information";
import { StripeCustomerPortal } from "@/app/app/(dashboard)/settings/billing/stripe-customer-portal";
import { completeOnboardingStep } from "@/app/services/onboarding/onboarding-service";
import { ONBOARDING_STEPS, getNextStepPath } from "@/app/services/onboarding/onboarding-steps";
import { checkoutAction, getCachedPricing, getCurrentBilling } from "@/app/services/platform";
import { OnboardingAction } from "@/components/onboarding/onboarding-action";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { PricingPlanForm } from "@/components/pricing/pricing-plan-form";
import {
  getPlanDisplayLabel,
  getSubscriptionInfo,
  hasActiveProSubscription
} from "@/utils/subscription-utils";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const billing = await getCurrentBilling();
  const pricingData = await getCachedPricing();

  const subscriptionInfo = getSubscriptionInfo(billing);
  const hasActiveSubscription = hasActiveProSubscription(subscriptionInfo);
  const planDisplayName = billing?.planType ? getPlanDisplayLabel(billing.planType) : "Your plan";

  const currentStep = ONBOARDING_STEPS["pricing"];
  const nextPath = getNextStepPath(currentStep.name);

  // Button configurations for PricingPlanForm
  const getButtonConfigs = () => {
    const { isFree, isSubscriptionActive } = subscriptionInfo;

    if (!subscriptionInfo || isFree) {
      return {
        freeButtonConfig: { label: "Continue with Free" },
        proButtonConfig: { label: "Upgrade to Pro" }
      };
    } else {
      return {
        freeButtonConfig: { label: "Continue with Free" },
        proButtonConfig: {
          label: isSubscriptionActive ? "Current Plan" : "Reactivate Pro",
          disabled: isSubscriptionActive
        }
      };
    }
  };

  const { freeButtonConfig, proButtonConfig } = getButtonConfigs();

  async function handleSelectFreeOnboarding() {
    "use server";
    await completeOnboardingStep("pricing");
    redirect(nextPath);
  }

  async function handleSelectProOnboarding(priceId: string) {
    "use server";
    const formData = new FormData();
    formData.append("priceId", priceId);
    await checkoutAction(formData);
  }

  return (
    <div className="relative space-y-6">
      <OnboardingHeader title={currentStep.title} description={currentStep.description} />

      {hasActiveSubscription ? (
        <div className="mx-auto flex max-w-md flex-col gap-10 pt-4">
          <PlanInformation
            subscriptionInfo={subscriptionInfo}
            planDisplayName={planDisplayName}
            customerPortal={<StripeCustomerPortal returnPath="/onboarding/pricing" />}
          />
          <OnboardingAction
            currentStep={currentStep.name}
            nextPath={nextPath}
            label="Continue & Finish"
          />
        </div>
      ) : (
        <PricingPlanForm
          pricingData={pricingData}
          currentSubscriptionInfo={subscriptionInfo}
          onSelectFree={handleSelectFreeOnboarding}
          onSelectPro={handleSelectProOnboarding}
          freeButtonConfig={freeButtonConfig}
          proButtonConfig={proButtonConfig}
          returnPath={"/onboarding/pricing"}
        />
      )}
    </div>
  );
}
