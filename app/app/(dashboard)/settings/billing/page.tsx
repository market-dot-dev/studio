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

  // Button configurations for PricingPlanForm
  const getButtonConfig = () => {
    const defaultConfig = {
      freeButton: { label: "Downgrade to Free" },
      proButton: { label: "Upgrade to Pro" },
      customButton: { label: "Get in touch" }
    };

    if (!subscriptionInfo) {
      return defaultConfig;
    }

    const { isFree, isCustom, isSubscriptionActive } = subscriptionInfo;

    if (isFree) {
      return {
        ...defaultConfig,
        freeButton: {
          label: "Current Plan",
          disabled: true
        }
      };
    }

    if (isCustom) {
      return {
        freeButton: {
          label: "Contact support to change plan",
          disabled: true
        },
        proButton: {
          label: "Contact support to change plan",
          disabled: true
        },
        customButton: {
          label: "Current Plan",
          disabled: true
        }
      };
    }

    if (isSubscriptionActive) {
      return {
        ...defaultConfig,
        proButton: {
          label: "Current Plan",
          disabled: true
        }
      };
    } else {
      return {
        ...defaultConfig,
        proButton: {
          label: "Reactivate Pro"
        }
      };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="flex w-full flex-col gap-8">
      <h2 className="text-xl font-bold">Your Plan</h2>
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
        <h2 className="text-xl font-bold">All Plans</h2>
        <PricingPlanForm
          pricingData={pricingData}
          currentSubscriptionInfo={subscriptionInfo}
          onSelectFree={handleSelectFree}
          onSelectPro={handleSelectPro}
          buttonConfig={buttonConfig}
        />
      </div>
    </div>
  );
}
