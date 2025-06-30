"use client";

import { Switch } from "@/components/ui/switch";
import { PlanPricing, PricingData } from "@/types/platform";
import { useState } from "react";
import { PricingTableCard } from "./pricing-table-card";

interface PricingTableProps {
  priceIds: PlanPricing;
  pricingData: PricingData;
  className?: string;
}

export function PricingTable({ priceIds, pricingData, className }: PricingTableProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const formatPrice = (amount: number, currency: string, isAnnualPrice: boolean = false) => {
    // If it's an annual price, divide by 12 to show monthly equivalent
    const displayAmount = isAnnualPrice ? amount / 12 : amount;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0
    }).format(displayAmount / 100); // Convert from cents
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <div className="flex w-full items-center justify-center space-x-3 text-center font-semibold lg:-mx-3 lg:w-4/5">
          <span className="w-full text-right text-muted-foreground">Monthly</span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span className="inline-flex w-full items-center gap-1 text-left text-muted-foreground">
            Annually{" "}
            <span className="hidden text-sm font-bold text-primary sm:inline-block">
              (Save 20%)
            </span>
          </span>
        </div>
        <div className="mt-4 text-center text-sm font-bold text-primary sm:hidden">
          Save 20% yearly
        </div>
      </div>

      <div className="my-8 flex flex-col items-center gap-10 md:flex-row md:items-stretch">
        <PricingTableCard
          title="FREE"
          tagline="Perfect for getting started"
          price="Free"
          isAnnual={false}
          features={[
            { text: "Basic project setup" },
            { text: "Up to 1 project per month" },
            { text: "1 team member" },
            { text: "Community support" },
            { text: "Advanced features", negate: true },
            { text: "Priority support", negate: true }
          ]}
          priceId={null} // FREE plan doesn't need a priceId
        />

        <PricingTableCard
          title="PRO"
          tagline="Perfect for growing teams"
          price={formatPrice(
            isAnnual ? pricingData.pro_annually.amount : pricingData.pro_monthly.amount,
            isAnnual ? pricingData.pro_annually.currency : pricingData.pro_monthly.currency,
            isAnnual // Pass true if showing annual price
          )}
          isAnnual={isAnnual}
          features={[
            { text: "AI-driven project setup" },
            { text: "Unlimited projects" },
            { text: "Unlimited team members" },
            { text: "Full scope customization" },
            { text: "Advanced project planning" },
            { text: "Team calibration" },
            { text: "Priority email & chat support" }
          ]}
          priceId={isAnnual ? priceIds.pro.yearly : priceIds.pro.monthly}
        />
      </div>
    </div>
  );
}
