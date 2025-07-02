"use client";

import { CUSTOM_PLAN_CONTACT_URL } from "@/app/config/checkout";
import { OrganizationBilling } from "@/app/generated/prisma";
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
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { FeatureItem, SharedFeatureList } from "./shared-feature-list";

interface ButtonConfig {
  freeButton: {
    label: string;
    disabled?: boolean;
  };
  proButton: {
    label: string;
    disabled?: boolean;
  };
  customButton?: {
    label: string;
    disabled?: boolean;
  };
}

interface PricingPlanFormProps {
  pricingData: PricingData;
  currentSubscriptionInfo?: SubscriptionInfo;
  billing?: OrganizationBilling | null;
  onSelectFree: () => Promise<void> | void;
  onSelectPro: (priceId: string) => Promise<void> | void;
  buttonConfig: ButtonConfig;
  showCustomPlan?: boolean;
}

type Plan = "free" | "pro" | "custom";

export function PricingPlanForm({
  pricingData,
  currentSubscriptionInfo,
  onSelectFree,
  onSelectPro,
  showCustomPlan = true,
  buttonConfig
}: PricingPlanFormProps) {
  const router = useRouter();

  const currentPlan: Plan = hasActiveProSubscription(currentSubscriptionInfo)
    ? "pro"
    : currentSubscriptionInfo?.isCustom
      ? "custom"
      : "free";

  const [isPending, startTransition] = useTransition();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(currentPlan);
  const [isAnnual, setIsAnnual] = useState(false);

  const discountPercentage = useMemo(() => {
    if (!pricingData?.pro_monthly || !pricingData?.pro_annually) return 0;
    const monthlyYearly = pricingData.pro_monthly.amount * 12;
    const annual = pricingData.pro_annually.amount;
    return Math.round(((monthlyYearly - annual) / monthlyYearly) * 100);
  }, [pricingData]);

  const handleSubmit = async () => {
    if (selectedPlan === "free") {
      await onSelectFree();
    } else if (selectedPlan === "custom") {
      router.push(CUSTOM_PLAN_CONTACT_URL);
    } else {
      const currentPrice = isAnnual ? pricingData.pro_annually : pricingData.pro_monthly;
      await onSelectPro(currentPrice.id);
    }
  };

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
        <div className="relative size-full @2xl:max-w-[370px] @2xl:shrink-0">
          <label className="cursor-pointer">
            <Card className="shadow-border transition-shadow hover:shadow-border-md [&:has(input:checked)]:shadow-border-md [&:has(input:checked)]:ring-4 [&:has(input:checked)]:ring-swamp">
              <div className="relative flex flex-col  px-6 pb-6 pt-5 @2xl:pb-8 ">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold tracking-tightish">Free</h3>
                    {currentPlan === "free" && (
                      <Badge size="sm" variant="outline" className="h-fit translate-y-px">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="plan"
                    value="free"
                    checked={selectedPlan === "free"}
                    onChange={(e) => setSelectedPlan(e.target.value as Plan)}
                    className="absolute right-6 top-6 border-stone-400 transition-colors checked:border-swamp checked:text-swamp checked:shadow-sm focus:outline-none focus:ring-0"
                  />
                </div>

                <p className="mb-6 text-pretty text-sm text-muted-foreground">
                  Only pay when you get paid
                </p>

                <div className="mb-6 flex h-8 items-center">
                  <span className="text-3xl font-semibold tracking-tight">$0</span>
                </div>

                <div className="flex items-start gap-2 @2xl:mb-5">
                  <CreditCard className="size-4 shrink-0 translate-y-0.5 text-muted-foreground" />
                  <span className="text-pretty text-sm text-muted-foreground">
                    $0.25 transaction fee + 1% per sale
                  </span>
                </div>

                <SharedFeatureList className="hidden @2xl:block" />
              </div>
            </Card>
          </label>
        </div>

        {/* Pro Plan */}
        <div className="relative size-full @2xl:max-w-[370px] @2xl:shrink-0">
          <label className="cursor-pointer">
            <Card className="shadow-border transition-shadow hover:shadow-border-md [&:has(input:checked)]:shadow-border-md [&:has(input:checked)]:ring-4 [&:has(input:checked)]:ring-swamp">
              <div className="relative flex flex-col px-6 pb-6 pt-5  @2xl:pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold tracking-tightish">Pro</h3>
                    {currentPlan === "pro" && (
                      <Badge size="sm" variant="outline" className="h-fit translate-y-px">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="plan"
                    value="pro"
                    checked={selectedPlan === "pro"}
                    onChange={(e) => setSelectedPlan(e.target.value as Plan)}
                    className="absolute right-6 top-6 border-stone-400 transition-colors checked:border-swamp checked:text-swamp checked:shadow-sm focus:outline-none focus:ring-0"
                  />
                </div>

                <p className="mb-6 text-pretty text-sm text-muted-foreground">
                  Reliable pricing for growing businesses
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

                <div className="flex items-start gap-2 @2xl:mb-5">
                  <CreditCard className="size-4 shrink-0 translate-y-0.5 text-muted-foreground" />
                  <span className="text-pretty text-sm text-muted-foreground">
                    $0.25 transaction fee (no commission fee)
                  </span>
                </div>

                <SharedFeatureList className="hidden @2xl:block" />
              </div>
            </Card>
          </label>
        </div>

        {/* Custom Plan */}
        {showCustomPlan && (
          <div className="relative size-full @2xl:max-w-[370px] @2xl:shrink-0">
            <label className="cursor-pointer">
              <Card className="shadow-border transition-shadow hover:shadow-border-md [&:has(input:checked)]:shadow-border-md [&:has(input:checked)]:ring-4 [&:has(input:checked)]:ring-swamp">
                <div className="relative flex flex-col  px-6 pb-6 pt-5 @2xl:pb-8 ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold tracking-tightish">Custom</h3>
                      {currentPlan === "custom" && (
                        <Badge size="sm" variant="outline" className="h-fit translate-y-px">
                          Current Plan
                        </Badge>
                      )}
                    </div>
                    <input
                      type="radio"
                      name="plan"
                      value="custom"
                      checked={selectedPlan === "custom"}
                      onChange={(e) => setSelectedPlan(e.target.value as Plan)}
                      className="absolute right-6 top-6 border-stone-400 transition-colors checked:border-swamp checked:text-swamp checked:shadow-sm focus:outline-none focus:ring-0"
                    />
                  </div>

                  <p className="mb-6 text-pretty text-sm text-muted-foreground">
                    For businesses at any scale
                  </p>

                  <div className="mb-6 flex h-8 items-center">
                    <span className="text-3xl font-semibold tracking-tight">Contact us</span>
                  </div>

                  <div className="mb-5 flex items-start gap-2">
                    <CreditCard className="size-4 shrink-0 translate-y-0.5 text-muted-foreground" />
                    <span className="text-pretty text-sm text-muted-foreground">
                      Custom pricing for your business
                    </span>
                  </div>

                  <div className="hidden @2xl:block">
                    <SharedFeatureList />
                  </div>
                  <div className="space-y-1">
                    <FeatureItem feature="Dedicated customer success manager" />
                    <FeatureItem feature="Premium support" />
                    <FeatureItem feature="SLA" />
                  </div>
                </div>
              </Card>
            </label>
          </div>
        )}
      </div>

      {/* Mobile features list */}
      <div className="mt-2 flex w-full flex-col @2xl:hidden">
        <p className="mb-1.5 text-sm font-semibold text-foreground">All plans include:</p>
        <Separator className="mb-2.5" />
        <SharedFeatureList />
      </div>

      <div className="sticky bottom-0 bg-stone-150 py-4 @2xl:static @2xl:py-0">
        <div className="mx-auto flex flex-col gap-3 @2xl:max-w-md">
          <Button
            onClick={() => startTransition(async () => await handleSubmit())}
            loading={isPending}
            className="w-full"
            disabled={
              (selectedPlan === "pro" && buttonConfig.proButton.disabled) ||
              (selectedPlan === "free" && buttonConfig.freeButton.disabled) ||
              (selectedPlan === "custom" &&
                (buttonConfig.customButton?.disabled || !showCustomPlan))
            }
          >
            {selectedPlan === "pro"
              ? buttonConfig.proButton.label
              : selectedPlan === "free"
                ? buttonConfig.freeButton.label
                : buttonConfig.customButton?.label || "Get in touch"}
          </Button>
        </div>
      </div>
    </div>
  );
}
