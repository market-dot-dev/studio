"use client";

import { CUSTOM_PLAN_CONTACT_URL } from "@/app/config/checkout";
import { PlanConfig } from "@/app/services/plan-configuration";
import { Badge } from "@/components/ui/badge";
import { PricingData } from "@/types/platform";
import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BillingCycleSwitcher } from "./billing-cycle-switcher";
import { MobileFeaturesList } from "./mobile-features-list";
import { PlanCard } from "./plan-card";
import { FeatureItem, SharedFeatureList } from "./shared-feature-list";

interface PricingTableProps {
  pricingData: PricingData;
  plans: PlanConfig[];
  onSelectFree: () => Promise<void>;
  onSelectPro: (priceId: string) => Promise<void>;
}

export function PricingTable({ pricingData, plans, onSelectFree, onSelectPro }: PricingTableProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();

  const discountPercentage = useMemo(() => {
    if (!pricingData?.pro_monthly || !pricingData?.pro_annually) return 0;
    const monthlyYearly = pricingData.pro_monthly.amount * 12;
    const annual = pricingData.pro_annually.amount;
    return Math.round(((monthlyYearly - annual) / monthlyYearly) * 100);
  }, [pricingData]);

  const handlePlanSelect = async (plan: PlanConfig) => {
    if (plan.id === "custom") {
      router.push(CUSTOM_PLAN_CONTACT_URL);
      return;
    }

    if (plan.id === "pro") {
      const currentPrice = isAnnual ? pricingData.pro_annually : pricingData.pro_monthly;
      await onSelectPro(currentPrice.id);
      return;
    }

    if (plan.id === "free") {
      await onSelectFree();
      return;
    }
  };

  const renderPlanCard = (plan: PlanConfig) => {
    let price: React.ReactNode = plan.id === "free" ? "$0" : "Contact us";
    let priceSubtext: React.ReactNode = undefined;

    if (plan.id === "pro") {
      price = (
        <NumberFlow
          value={
            (isAnnual ? pricingData.pro_annually.amount : pricingData.pro_monthly.amount) /
            100 /
            (isAnnual ? 12 : 1)
          }
          format={{
            style: "currency",
            currency: isAnnual
              ? pricingData.pro_annually.currency
              : pricingData.pro_monthly.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }}
          suffix="/mo"
        />
      );

      priceSubtext = (
        <AnimatePresence>
          {isAnnual && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: -4,
                transition: {
                  duration: 0.15,
                  ease: "easeOut"
                }
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut"
              }}
              className="absolute right-0 top-1.5"
            >
              <Badge variant="secondary" className="rounded py-0.5 pr-1">
                Save {discountPercentage}%
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      );
    }

    const features = plan.showCustomFeatures ? (
      <>
        <div className="hidden @2xl:block">
          <SharedFeatureList />
        </div>
        <div className="space-y-1">
          <FeatureItem feature="Dedicated customer success manager" />
          <FeatureItem feature="Premium support" />
          <FeatureItem feature="SLA" />
        </div>
      </>
    ) : (
      <SharedFeatureList className="hidden @2xl:block" />
    );

    return (
      <PlanCard
        key={plan.id}
        title={plan.title}
        description={plan.description}
        price={price}
        priceSubtext={priceSubtext}
        transactionFee={plan.transactionFee}
        features={features}
        isCurrentPlan={plan.isCurrentPlan}
        buttonLabel={plan.buttonLabel}
        disabled={plan.buttonDisabled}
        action={() => handlePlanSelect(plan)}
      />
    );
  };

  return (
    <div className="flex flex-col gap-y-6 @container @2xl:gap-y-10">
      {/* Monthly/Yearly Switcher */}
      <BillingCycleSwitcher isAnnual={isAnnual} onToggle={setIsAnnual} />

      {/* Plan Cards */}
      <div
        className={`mx-auto flex w-full max-w-7xl flex-col gap-6 @2xl:flex-row @2xl:flex-wrap @2xl:justify-center @2xl:gap-6 ${
          plans.length === 3 ? "@2xl:grid-cols-3" : "@2xl:grid-cols-2"
        }`}
      >
        {plans.map(renderPlanCard)}
      </div>

      {/* Mobile features list */}
      <MobileFeaturesList />
    </div>
  );
}
