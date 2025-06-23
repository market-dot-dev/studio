import { PlanInformation } from "@/app/app/(dashboard)/settings/billing/plan-information";
import { StripeCustomerPortal } from "@/app/app/(dashboard)/settings/billing/stripe-customer-portal";
import { completeOnboardingStep } from "@/app/services/onboarding/onboarding-service";
import { ONBOARDING_STEPS } from "@/app/services/onboarding/onboarding-steps";
import {
  checkoutAction,
  getCachedPricing,
  getCurrentBilling,
  getPlanPricing
} from "@/app/services/platform";
import { Button } from "@/components/ui/button";
import { getPlanDisplayLabel, getSubscriptionInfo } from "@/utils/subscription-utils";
import { redirect } from "next/navigation";
import { PricingPageForm } from "./pricing-page-form";

async function updatePlan(prevState: any, formData: FormData) {
  "use server";

  const selectedPlan = formData.get("plan") as "free" | "pro";
  const isAnnual = formData.get("isAnnual") === "true";

  const billing = await getCurrentBilling();
  const subscriptionInfo = getSubscriptionInfo(billing);

  if (selectedPlan === "pro" && subscriptionInfo.isFree) {
    const planPricing = await getPlanPricing();
    const checkoutFormData = new FormData();
    checkoutFormData.append("priceId", isAnnual ? planPricing.pro.yearly : planPricing.pro.monthly);
    checkoutFormData.append("returnPath", `/onboarding/pricing`);
    await checkoutAction(checkoutFormData);
    return { error: "" };
  }

  await completeOnboardingStep(ONBOARDING_STEPS.PRICING);
  redirect("/onboarding/complete");
}

async function handleContinue() {
  "use server";
  await completeOnboardingStep(ONBOARDING_STEPS.PRICING);
  redirect("/onboarding/complete");
}

export default async function PricingPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  if (params.status === "success") {
    // Mark onboarding step as completed when returning from Stripe
    await completeOnboardingStep(ONBOARDING_STEPS.PRICING);
    redirect("/onboarding/complete?status=success");
  }

  const billing = await getCurrentBilling();
  const pricingData = await getCachedPricing();

  const subscriptionInfo = getSubscriptionInfo(billing);
  const hasActiveSubscription = subscriptionInfo.isSubscriptionActive && !subscriptionInfo.isFree;
  const defaultPlan = hasActiveSubscription ? "pro" : "free";

  // Get plan display name for subscribed users
  const planDisplayName = billing?.planType ? getPlanDisplayLabel(billing.planType) : "Free plan";

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
          <form action={handleContinue}>
            <Button type="submit" className="w-full">
              Continue & Finish
            </Button>
          </form>
        </div>
      ) : (
        <PricingPageForm
          pricingData={pricingData}
          defaultPlan={defaultPlan}
          updatePlan={updatePlan}
        />
      )}
    </div>
  );
}
