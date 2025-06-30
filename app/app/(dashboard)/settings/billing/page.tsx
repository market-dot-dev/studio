"use server";

import {
  checkoutAction,
  customerPortalAction,
  getCachedPricing,
  getCurrentBilling
} from "@/app/services/platform";
import { PricingPlanForm } from "@/components/pricing/pricing-plan-form";
import { Separator } from "@/components/ui/separator";
import {
  getPlanDisplayLabel,
  getSubscriptionInfo,
  hasActiveProSubscription
} from "@/utils/subscription-utils";
import { redirect } from "next/navigation";
import { PlanInformation } from "./plan-information";
import { StripeCustomerPortal } from "./stripe-customer-portal";

export default async function BillingSettingsPage() {
  const billing = await getCurrentBilling();
  const pricingData = await getCachedPricing();

  const subscriptionInfo = getSubscriptionInfo(billing);
  const planDisplayName = billing?.planType ? getPlanDisplayLabel(billing.planType) : "Free";

  async function handleSelectFree() {
    "use server";

    // If user is on Pro and wants to downgrade, redirect to customer portal
    if (hasActiveProSubscription(subscriptionInfo)) {
      const formData = new FormData();
      formData.append("returnPath", "/settings/billing");
      await customerPortalAction(formData);
    } else {
      // Already on free plan or inactive subscription - just reload the page
      redirect("/settings/billing");
    }
  }

  async function handleSelectPro(priceId: string) {
    "use server";

    const formData = new FormData();
    formData.append("priceId", priceId);
    formData.append("returnPath", "/settings/billing");
    await checkoutAction(formData);
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <h2 className="text-xl/6 font-bold">Your Plan</h2>
      <div>
        <PlanInformation
          subscriptionInfo={subscriptionInfo}
          planDisplayName={planDisplayName}
          customerPortal={
            // Only show customer portal for PRO plans with active subscriptions
            hasActiveProSubscription(subscriptionInfo) ? <StripeCustomerPortal /> : undefined
          }
        />
      </div>

      <Separator />

      <div id="pricing-plans" className="flex scroll-mt-20 flex-col gap-8">
        <h2 className="text-xl/6 font-bold">Change plans</h2>
        <PricingPlanForm
          pricingData={pricingData}
          currentSubscriptionInfo={subscriptionInfo}
          onSelectFree={handleSelectFree}
          onSelectPro={handleSelectPro}
        />
      </div>
    </div>
  );
}
