import { PlanInformation } from "@/app/app/(dashboard)/settings/billing/plan-information";
import { StripeCustomerPortal } from "@/app/app/(dashboard)/settings/billing/stripe-customer-portal";
import { ONBOARDING_STEPS, getNextStepPath } from "@/app/services/onboarding/onboarding-steps";
import { getCachedPricing, getCurrentBilling } from "@/app/services/platform";
import { getPlanDisplayLabel, getSubscriptionInfo } from "@/utils/subscription-utils";
import { OnboardingAction } from "../onboarding-action";
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
      <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Finally, Choose Your Plan</h1>
        <p className="text-sm text-muted-foreground">
          Start for free or upgrade to Pro for commission-free sales & priority support.
        </p>
      </div>

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
