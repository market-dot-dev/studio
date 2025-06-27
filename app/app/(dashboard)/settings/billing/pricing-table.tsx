"use client";

import { PricingPageForm } from "@/components/pricing/pricing-page-form";
import { PlanPricing, PricingData } from "@/types/platform";

interface PricingTableProps {
  priceIds: PlanPricing;
  pricingData: PricingData;
  className?: string;
}

export function PricingTable({ priceIds, pricingData, className }: PricingTableProps) {
  return (
    <div className={className}>
      <PricingPageForm
        pricingData={pricingData}
        defaultPlan="free"
        returnPath="/settings/billing"
        proButtonLabel="Upgrade to Pro"
        isOnboarding={false}
      />
    </div>
  );
}
