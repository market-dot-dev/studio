import { PlanInformation } from "@/app/app/(dashboard)/settings/billing/plan-information";
import { StripeCustomerPortal } from "@/app/app/(dashboard)/settings/billing/stripe-customer-portal";
import { completeOnboardingStep } from "@/app/services/onboarding/onboarding-service";
import { ONBOARDING_STEPS, getNextStepPath } from "@/app/services/onboarding/onboarding-steps";
import { checkoutAction, getCachedPricing, getCurrentBilling } from "@/app/services/platform";
import { OnboardingAction } from "@/components/onboarding/onboarding-action";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { PricingTable } from "@/components/pricing/pricing-table";
import { createPlanConfiguration } from "@/utils/plan-configuration";
import { getPlanDisplayLabel, getSubscriptionInfo } from "@/utils/subscription-utils";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const billing = await getCurrentBilling();
  const pricingData = await getCachedPricing();

  const subscriptionInfo = getSubscriptionInfo(billing);
  const planDisplayName = billing?.planType ? getPlanDisplayLabel(billing.planType) : "Your plan";

  const currentStep = ONBOARDING_STEPS["pricing"];
  const nextPath = getNextStepPath(currentStep.name);

  async function handleSelectFree() {
    "use server";

    await completeOnboardingStep("pricing");
    redirect(nextPath);
  }

  async function handleSelectPro(priceId: string) {
    "use server";

    const formData = new FormData();
    formData.append("priceId", priceId);
    formData.append("returnPath", "/onboarding/pricing");
    await checkoutAction(formData);
  }

  // Create plan configuration for onboarding context
  const plans = createPlanConfiguration({
    subscriptionInfo,
    includeCustomPlan: false, // Don't show custom plan during onboarding
    context: "onboarding" // This ensures proper button labels and states
  });

  return (
    <div className="relative space-y-6">
      <OnboardingHeader title={currentStep.title} description={currentStep.description} />

      {subscriptionInfo.isSubscriptionActive || subscriptionInfo.isCustom ? (
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
        <PricingTable
          pricingData={pricingData}
          plans={plans}
          onSelectFree={handleSelectFree}
          onSelectPro={handleSelectPro}
        />
      )}
    </div>
  );
}
