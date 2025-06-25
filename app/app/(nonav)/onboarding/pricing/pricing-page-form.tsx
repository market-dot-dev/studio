"use client";

import { completeOnboardingStep } from "@/app/services/onboarding/onboarding-service";
import { ONBOARDING_STEPS } from "@/app/services/onboarding/onboarding-steps";
import { checkoutAction, getCurrentBilling, getPlanPricing } from "@/app/services/platform";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingData } from "@/types/platform";
import { getSubscriptionInfo } from "@/utils/subscription-utils";
import NumberFlow from "@number-flow/react";
import { CreditCard } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { FeatureList } from "./feature-list";
interface PricingPageFormProps {
  pricingData: PricingData;
  defaultPlan: "free" | "pro";
}

export function PricingPageForm({ pricingData, defaultPlan }: PricingPageFormProps) {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">(defaultPlan);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const discountPercentage = useMemo(() => {
    const monthlyPrice = pricingData.pro_monthly.amount / 100;
    const annualPricePerMonth = pricingData.pro_annually.amount / 100 / 12;
    const savings = monthlyPrice - annualPricePerMonth;
    const percentage = (savings / monthlyPrice) * 100;
    return Math.round(percentage);
  }, [pricingData.pro_monthly.amount, pricingData.pro_annually.amount]);

  const handleContinue = async () => {
    try {
      if (selectedPlan === "free") {
        await completeOnboardingStep(ONBOARDING_STEPS.PRICING);
        router.push("/onboarding/complete");
        return;
      }

      // Redirect to Stripe checkout if user is currently on Free plan and upgrading to Pro.
      const billing = await getCurrentBilling();
      const subscriptionInfo = getSubscriptionInfo(billing);

      if (subscriptionInfo.isFree) {
        const planPricing = await getPlanPricing();
        const checkoutFormData = new FormData();
        checkoutFormData.append(
          "priceId",
          isAnnual ? planPricing.pro.yearly : planPricing.pro.monthly
        );
        checkoutFormData.append("returnPath", `/onboarding/pricing`);
        await checkoutAction(checkoutFormData);
      }
    } catch (error) {
      console.error("Failed to continue:", error);
    }
  };

  return (
    <div className="flex flex-col gap-y-6 md:gap-y-10">
      {/* Monthly/Yearly Switcher */}
      <div className="flex w-full items-center justify-center">
        <Tabs
          value={isAnnual ? "yearly" : "monthly"}
          onValueChange={(value) => setIsAnnual(value === "yearly")}
          className="w-full md:w-fit"
        >
          <TabsList variant="background" className="w-full md:w-fit">
            <TabsTrigger value="monthly" variant="background" className="w-full md:w-fit">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" variant="background" className="w-full md:w-fit">
              Yearly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-4 md:flex-nowrap md:gap-6">
        {/* Free Plan */}
        <div className="relative w-full md:max-w-[370px]">
          <label className="cursor-pointer">
            <Card className="shadow-border transition-shadow hover:shadow-border-md [&:has(input:checked)]:shadow-border-md [&:has(input:checked)]:ring-4 [&:has(input:checked)]:ring-swamp">
              <div className="relative flex flex-col items-center px-6 pb-7 pt-5 text-center md:items-start md:pb-8 md:text-left">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="text-xl font-semibold tracking-tightish">Free</h3>
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

                <p className="text-pretty text-sm text-muted-foreground md:mb-6">
                  <CreditCard className="mr-2 inline size-4 shrink-0 -translate-y-px text-muted-foreground" />
                  $0.25 transaction fee + 1% per sale
                </p>

                <FeatureList className="hidden md:block" />
              </div>
            </Card>
          </label>
        </div>

        {/* Pro Plan */}
        <div className="relative w-full md:max-w-[370px]">
          <label className="cursor-pointer">
            <Card className="shadow-border transition-shadow hover:shadow-border-md [&:has(input:checked)]:shadow-border-md [&:has(input:checked)]:ring-4 [&:has(input:checked)]:ring-swamp">
              <div className="relative flex flex-col items-center px-6 pb-7 pt-5 text-center md:items-start md:pb-8 md:text-left">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="text-xl font-semibold tracking-tightish">Pro</h3>
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

                <div className="mb-6 w-fit md:relative md:w-full">
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
                        className="absolute -top-px left-0 md:left-auto md:right-0 md:top-1.5"
                      >
                        <Badge
                          variant="secondary"
                          className="rounded-bl-none rounded-br-md rounded-tl-md rounded-tr-none py-1 pr-1 md:rounded md:py-0.5"
                        >
                          Save {discountPercentage}%
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <p className="text-pretty text-sm text-muted-foreground md:mb-6">
                  <CreditCard className="mr-2 inline size-4 shrink-0 -translate-y-px text-muted-foreground" />
                  $0.25 transaction fee (no commission fee)
                </p>

                <FeatureList className="hidden md:block" />
              </div>
            </Card>
          </label>
        </div>
      </div>

      {/* Mobile features list */}
      <div className="mt-1 flex w-full flex-col md:hidden">
        <p className="mb-1.5 text-sm font-semibold text-foreground">All plans include:</p>
        <Separator className="mb-2.5" />
        <FeatureList />
      </div>

      <div className="sticky bottom-0 bg-stone-150 py-4 md:static md:py-0">
        <div className="mx-auto flex flex-col gap-3 md:max-w-md">
          <Button
            onClick={() => startTransition(() => handleContinue())}
            loading={isPending}
            className="w-full"
          >
            {selectedPlan === "pro" ? "Continue with Pro plan" : "Continue & Finish"}
          </Button>
        </div>
      </div>
    </div>
  );
}
