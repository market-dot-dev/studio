"use server";

import { getCachedPricing, getCurrentBilling, getPlanPricing } from "@/app/services/platform";
import { getPlanDisplayLabel, getSubscriptionInfo } from "@/utils/subscription-utils";
import { CheckoutStatusBanner } from "./checkout-status-banner";
import { PlanInformation } from "./plan-information";
import { PricingTable } from "./pricing-table";
import { StripeCustomerPortal } from "./stripe-customer-portal";

export default async function BillingSettingsPage() {
  const billing = await getCurrentBilling();
  const planPricing = await getPlanPricing();
  const pricingData = await getCachedPricing();

  const subscriptionInfo = getSubscriptionInfo(billing);
  const planDisplayName = billing?.planType ? getPlanDisplayLabel(billing.planType) : "Free plan";

  return (
    <div className="space-y-6">
      <div>
        <CheckoutStatusBanner />
        <PlanInformation
          subscriptionInfo={subscriptionInfo}
          planDisplayName={planDisplayName}
          customerPortal={
            // Only show customer portal for PRO plans with active subscriptions
            subscriptionInfo.isSubscriptionActive && !subscriptionInfo.isFree ? (
              <StripeCustomerPortal />
            ) : undefined
          }
        />
      </div>

      {/* Only show pricing plans if not already on active PRO plan */}
      {!(subscriptionInfo.isSubscriptionActive && !subscriptionInfo.isFree) && (
        <div id="pricing-plans">
          <h2 className="mb-2 text-2xl font-bold">Available plans</h2>
          <p className="mb-6 text-muted-foreground">Choose the plan that best fits your needs.</p>
          <PricingTable priceIds={planPricing} pricingData={pricingData} />
        </div>
      )}
    </div>
  );
}
