"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingData, SubscriptionInfo } from "@/types/platform";
import { hasActiveProSubscription } from "@/utils/subscription-utils";
import NumberFlow from "@number-flow/react";
import { CreditCard } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, useTransition } from "react";
import { SharedFeatureList } from "./shared-feature-list";

interface PricingPlanFormProps {
  pricingData: PricingData;
  currentSubscriptionInfo?: SubscriptionInfo;
  onSelectFree: () => Promise<void> | void;
  onSelectPro: (priceId: string) => Promise<void> | void;
}

export function PricingPlanForm({
  pricingData,
  currentSubscriptionInfo,
  onSelectFree,
  onSelectPro
}: PricingPlanFormProps) {
  const currentPlan = hasActiveProSubscription(currentSubscriptionInfo) ? "pro" : "free";

  const [isPending, startTransition] = useTransition();
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">(currentPlan);
  const [isAnnual, setIsAnnual] = useState(false);

  const discountPercentage = useMemo(() => {
    if (!pricingData?.pro_monthly || !pricingData?.pro_annually) return 0;
    const monthlyYearly = pricingData.pro_monthly.amount * 12;
    const annual = pricingData.pro_annually.amount;
    return Math.round(((monthlyYearly - annual) / monthlyYearly) * 100);
  }, [pricingData]);

  const pricing = useMemo(() => {
    const currentPrice = isAnnual ? pricingData.pro_annually : pricingData.pro_monthly;
    const pricePerMonth = isAnnual ? currentPrice.amount / 12 : currentPrice.amount;

    return {
      free: { price: "Free", priceId: null },
      pro: {
        price: (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-semibold">$</span>
            <NumberFlow
              value={pricePerMonth / 100}
              format={{
                style: "decimal",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
              }}
              className="text-4xl font-semibold"
            />
            <span className="text-sm text-muted-foreground">
              /mo{isAnnual ? " (billed annually)" : ""}
            </span>
          </div>
        ),
        priceId: currentPrice.id
      }
    };
  }, [pricingData, isAnnual]);

  const handleSubmit = () => {
    startTransition(async () => {
      if (selectedPlan === "free") {
        await onSelectFree();
      } else {
        await onSelectPro(pricing.pro.priceId!);
      }
    });
  };

  const getButtonState = () => {
    if (!currentSubscriptionInfo) {
      // Default labels when no subscription info available
      return {
        freeButtonLabel: "Continue with Free",
        proButtonLabel: "Upgrade to Pro",
        isFreeDisabled: false,
        isProDisabled: false
      };
    }

    const { isFree, isSubscriptionActive } = currentSubscriptionInfo;

    if (isFree) {
      return {
        freeButtonLabel: "Current Plan",
        proButtonLabel: "Upgrade to Pro",
        isFreeDisabled: true,
        isProDisabled: false
      };
    } else {
      return {
        freeButtonLabel: "Downgrade to Free",
        proButtonLabel: isSubscriptionActive ? "Current Plan" : "Reactivate Pro",
        isFreeDisabled: false,
        isProDisabled: isSubscriptionActive
      };
    }
  };

  const buttonState = getButtonState();
  const isCurrentPlanSelected = currentSubscriptionInfo
    ? (selectedPlan === "free" && currentSubscriptionInfo.isFree) ||
      (selectedPlan === "pro" && hasActiveProSubscription(currentSubscriptionInfo))
    : false;

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

      <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-4 @2xl:flex-nowrap @2xl:gap-6">
        {/* Free Plan */}
        <div className="relative w-full @2xl:max-w-[370px]">
          <label className="cursor-pointer">
            <Card className="shadow-border transition-shadow hover:shadow-border-md [&:has(input:checked)]:shadow-border-md [&:has(input:checked)]:ring-4 [&:has(input:checked)]:ring-swamp">
              <div className="relative flex flex-col  px-6 pb-7 pt-5 @2xl:pb-8 ">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-semibold tracking-tightish">Free</h3>
                    {currentPlan === "free" && (
                      <Badge size="sm" variant="secondary" className="h-fit translate-y-px">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="plan"
                    value="free"
                    checked={selectedPlan === "free"}
                    onChange={(e) => setSelectedPlan(e.target.value as "free" | "pro")}
                    className="absolute right-6 top-6 border-stone-400 transition-colors checked:border-swamp checked:text-swamp checked:shadow-sm focus:outline-none focus:ring-0"
                  />
                </div>

                <p className="mb-6 text-pretty text-sm text-muted-foreground">
                  For freelancers just getting started
                </p>

                <div className="mb-6 flex h-8 items-center">
                  <span className="text-3xl font-semibold tracking-tight">$0</span>
                </div>

                <p className="text-pretty text-sm text-muted-foreground @2xl:mb-6">
                  <CreditCard className="mr-2 inline size-4 shrink-0 -translate-y-px text-muted-foreground" />
                  $0.25 transaction fee + 1% per sale
                </p>

                <SharedFeatureList className="hidden @2xl:block" />
              </div>
            </Card>
          </label>
        </div>

        {/* Pro Plan */}
        <div className="relative w-full @2xl:max-w-[370px]">
          <label className="cursor-pointer">
            <Card className="shadow-border transition-shadow hover:shadow-border-md [&:has(input:checked)]:shadow-border-md [&:has(input:checked)]:ring-4 [&:has(input:checked)]:ring-swamp">
              <div className="relative flex flex-col px-6 pb-7 pt-5  @2xl:pb-8">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold tracking-tightish">Pro</h3>
                    {currentPlan === "pro" && (
                      <Badge size="sm" variant="secondary" className="h-fit translate-y-px">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="plan"
                    value="pro"
                    checked={selectedPlan === "pro"}
                    onChange={(e) => setSelectedPlan(e.target.value as "free" | "pro")}
                    className="absolute right-6 top-6 border-stone-400 transition-colors checked:border-swamp checked:text-swamp checked:shadow-sm focus:outline-none focus:ring-0"
                  />
                </div>

                <p className="mb-6 text-pretty text-sm text-muted-foreground">
                  For established freelancers & dev shops
                </p>

                <div className="relative mb-6 @2xl:w-full">
                  <div className="flex h-8 items-center">
                    <NumberFlow
                      className="text-3xl font-semibold tracking-tight"
                      value={
                        (isAnnual
                          ? pricingData.pro_annually.amount
                          : pricingData.pro_monthly.amount) /
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
                  </div>
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
                </div>

                <p className="text-pretty text-sm text-muted-foreground @2xl:mb-6">
                  <CreditCard className="mr-2 inline size-4 shrink-0 -translate-y-px text-muted-foreground" />
                  $0.25 transaction fee (no commission fee)
                </p>

                <SharedFeatureList className="hidden @2xl:block" />
              </div>
            </Card>
          </label>
        </div>
      </div>

      {/* Mobile features list */}
      <div className="mt-1 flex w-full flex-col @2xl:hidden">
        <p className="mb-1.5 text-sm font-semibold text-foreground">All plans include:</p>
        <Separator className="mb-2.5" />
        <SharedFeatureList />
      </div>

      <div className="sticky bottom-0 bg-stone-150 py-4 @2xl:static @2xl:py-0">
        <div className="mx-auto flex flex-col gap-3 @2xl:max-w-md">
          <Button
            onClick={() => startTransition(() => handleSubmit())}
            loading={isPending}
            className="w-full"
            disabled={isCurrentPlanSelected}
          >
            {selectedPlan === "pro" ? buttonState.proButtonLabel : buttonState.freeButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
