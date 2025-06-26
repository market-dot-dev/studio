import { PlanInformation } from "@/app/app/(dashboard)/settings/billing/plan-information";
import { StripeCustomerPortal } from "@/app/app/(dashboard)/settings/billing/stripe-customer-portal";
import { ONBOARDING_STEPS, getNextStepPath } from "@/app/services/onboarding/onboarding-steps";
import { getCachedPricing, getCurrentBilling } from "@/app/services/platform";
import { OnboardingAction } from "@/components/onboarding/onboarding-action";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { getPlanDisplayLabel, getSubscriptionInfo } from "@/utils/subscription-utils";
import { PricingPageForm } from "./pricing-page-form";

export default async function PricingPage() {
  const billing = await getCurrentBilling();
  const pricingData = await getCachedPricing();

  const subscriptionInfo = getSubscriptionInfo(billing);
  const hasActiveSubscription = subscriptionInfo.isSubscriptionActive && !subscriptionInfo.isFree;
  const defaultPlan = hasActiveSubscription ? "pro" : "free";
  const planDisplayName = billing?.planType ? getPlanDisplayLabel(billing.planType) : "Your plan";

  const currentStep = ONBOARDING_STEPS["pricing"];
  const nextPath = getNextStepPath(currentStep.name);

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
        <PricingPageForm pricingData={pricingData} defaultPlan={defaultPlan} />
      )}
    </div>
  );
}
