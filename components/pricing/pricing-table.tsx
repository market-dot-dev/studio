"use client";

import { CUSTOM_PLAN_CONTACT_URL } from "@/app/config/checkout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingData, SubscriptionInfo } from "@/types/platform";
import { hasActiveProSubscription } from "@/utils/subscription-utils";
import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PlanCard } from "./plan-card";
import { FeatureItem, SharedFeatureList } from "./shared-feature-list";

interface PricingTableProps {
  pricingData: PricingData;
  currentSubscriptionInfo?: SubscriptionInfo;
  plans: {
    free: {
      onSelect: () => Promise<void> | void;
      buttonLabel: string;
      disabled?: boolean;
    };
    pro: {
      onSelect: (priceId: string) => Promise<void> | void;
      buttonLabel: string;
      disabled?: boolean;
    };
    custom?:
      | {
          buttonLabel: string;
          disabled?: boolean;
        }
      | false;
  };
}

type Plan = "free" | "pro" | "custom";

export function PricingTable({ pricingData, currentSubscriptionInfo, plans }: PricingTableProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();

  const currentPlan: Plan = hasActiveProSubscription(currentSubscriptionInfo)
    ? "pro"
    : currentSubscriptionInfo?.isCustom
      ? "custom"
      : "free";

  const discountPercentage = useMemo(() => {
    if (!pricingData?.pro_monthly || !pricingData?.pro_annually) return 0;
    const monthlyYearly = pricingData.pro_monthly.amount * 12;
    const annual = pricingData.pro_annually.amount;
    return Math.round(((monthlyYearly - annual) / monthlyYearly) * 100);
  }, [pricingData]);

  const handleFreePlan = async () => {
    await plans.free.onSelect();
  };

  const handleProPlan = async () => {
    const currentPrice = isAnnual ? pricingData.pro_annually : pricingData.pro_monthly;
    await plans.pro.onSelect(currentPrice.id);
  };

  const handleCustomPlan = async () => {
    router.push(CUSTOM_PLAN_CONTACT_URL);
  };

  const showCustomPlan = !!plans.custom;

  return (
    <div className="flex flex-col gap-y-6 @container @2xl:gap-y-10">
      {/* Monthly/Yearly Switcher */}
      <div className="flex w-full items-center justify-center">
        <Tabs
          value={isAnnual ? "yearly" : "monthly"}
          onValueChange={(value) => setIsAnnual(value === "yearly")}
          className="w-full @2xl:w-fit"
        >
          <TabsList variant="background" className="w-full @2xl:w-fit">
            <TabsTrigger value="monthly" variant="background" className="w-full @2xl:w-fit">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" variant="background" className="w-full @2xl:w-fit">
              Yearly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div
        className={`mx-auto flex w-full max-w-7xl flex-col gap-6 @2xl:flex-row @2xl:flex-wrap @2xl:justify-center @2xl:gap-6 ${
          showCustomPlan ? "@2xl:grid-cols-3" : "@2xl:grid-cols-2"
        }`}
      >
        {/* Free Plan */}
        <PlanCard
          title="Free"
          description="Only pay when you get paid"
          price="$0"
          transactionFee="$0.25 transaction fee + 1% per sale"
          features={<SharedFeatureList className="hidden @2xl:block" />}
          isCurrentPlan={currentPlan === "free"}
          buttonLabel={plans.free.buttonLabel}
          disabled={plans.free.disabled}
          action={handleFreePlan}
        />

        {/* Pro Plan */}
        <PlanCard
          title="Pro"
          description="Reliable pricing for growing businesses"
          price={
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
          }
          priceSubtext={
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
          }
          transactionFee="$0.25 transaction fee (no commission fee)"
          features={<SharedFeatureList className="hidden @2xl:block" />}
          isCurrentPlan={currentPlan === "pro"}
          buttonLabel={plans.pro.buttonLabel}
          disabled={plans.pro.disabled}
          action={handleProPlan}
        />

        {/* Custom Plan */}
        {plans.custom && (
          <PlanCard
            title="Custom"
            description="For businesses at any scale"
            price="Contact us"
            transactionFee="Custom pricing for your business"
            features={
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
            }
            isCurrentPlan={currentPlan === "custom"}
            buttonLabel={plans.custom.buttonLabel}
            disabled={plans.custom.disabled}
            action={handleCustomPlan}
          />
        )}
      </div>

      {/* Mobile features list */}
      <div className="mt-2 flex w-full flex-col @2xl:hidden">
        <p className="mb-1.5 text-sm font-semibold text-foreground">All plans include:</p>
        <Separator className="mb-2.5" />
        <SharedFeatureList />
      </div>
    </div>
  );
}
