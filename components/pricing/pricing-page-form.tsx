"use client";

import { completeOnboardingStep } from "@/app/services/onboarding/onboarding-service";
import { checkoutAction } from "@/app/services/platform";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingData } from "@/types/platform";
import NumberFlow from "@number-flow/react";
import { CreditCard } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { SharedFeatureList } from "./shared-feature-list";

interface PricingPageFormProps {
  pricingData: PricingData;
  defaultPlan: "free" | "pro";
  returnPath?: string;
  onFreeSelected?: () => Promise<void> | void;
  freeButtonLabel?: string;
  proButtonLabel?: string;
  isOnboarding?: boolean;
}

export function PricingPageForm({
  pricingData,
  defaultPlan,
  returnPath,
  onFreeSelected,
  freeButtonLabel = "Continue with Free",
  proButtonLabel = "Upgrade to Pro",
  isOnboarding = true
}: PricingPageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">(defaultPlan);
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
        if (onFreeSelected) {
          await onFreeSelected();
        } else if (isOnboarding) {
          await completeOnboardingStep("pricing");
          router.push("/setup");
        } else if (returnPath) {
          router.push(returnPath);
        }
      } else {
        const formData = new FormData();
        formData.append("priceId", pricing.pro.priceId!);
        if (returnPath) {
          formData.append("returnPath", returnPath);
        }
        await checkoutAction(formData);
      }
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Choose your plan</h1>
        <p className="mt-2 text-muted-foreground">Start free and upgrade anytime</p>
      </div>

      <div className="mb-8 flex justify-center">
        <Tabs
          value={isAnnual ? "annual" : "monthly"}
          onValueChange={(value) => setIsAnnual(value === "annual")}
          className="w-fit"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual" className="relative">
              Annual
              {discountPercentage > 0 && (
                <Badge variant="secondary" className="absolute -right-2 -top-2 text-xs">
                  -{discountPercentage}%
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Plan */}
        <label className="cursor-pointer">
          <input
            type="radio"
            name="plan"
            value="free"
            checked={selectedPlan === "free"}
            onChange={() => setSelectedPlan("free")}
            className="absolute right-6 top-6 size-4"
          />
          <Card className="relative h-full p-6 shadow-border transition-shadow hover:shadow-border-md [&:has(input:checked)]:shadow-border-md [&:has(input:checked)]:ring-4 [&:has(input:checked)]:ring-swamp">
            <div className="flex flex-col gap-6 md:items-start md:text-left">
              <div>
                <h3 className="text-xl font-semibold">Free</h3>
                <p className="text-sm text-muted-foreground">Perfect for getting started</p>
              </div>

              <div className="text-4xl font-semibold">Free</div>

              <Separator />

              <SharedFeatureList />
            </div>
          </Card>
        </label>

        {/* Pro Plan */}
        <label className="cursor-pointer">
          <input
            type="radio"
            name="plan"
            value="pro"
            checked={selectedPlan === "pro"}
            onChange={() => setSelectedPlan("pro")}
            className="absolute right-6 top-6 size-4"
          />
          <Card className="relative h-full p-6 shadow-border transition-shadow hover:shadow-border-md [&:has(input:checked)]:shadow-border-md [&:has(input:checked)]:ring-4 [&:has(input:checked)]:ring-swamp">
            <Badge className="absolute right-6 top-6">Most Popular</Badge>
            <div className="flex flex-col gap-6 md:items-start md:text-left">
              <div>
                <h3 className="text-xl font-semibold">Pro</h3>
                <p className="text-sm text-muted-foreground">For growing businesses</p>
              </div>

              {pricing.pro.price}

              <AnimatePresence mode="wait">
                <motion.div
                  key={isAnnual ? "annual" : "monthly"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CreditCard className="size-4" />
                  <span>
                    2.9% + 30¢ transaction fee
                    {isAnnual && discountPercentage > 0 && (
                      <span className="ml-2 text-green-600">
                        Save {discountPercentage}% with annual billing
                      </span>
                    )}
                  </span>
                </motion.div>
              </AnimatePresence>

              <Separator />

              <SharedFeatureList />
            </div>
          </Card>
        </label>
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={handleSubmit} disabled={isPending} size="lg">
          {selectedPlan === "pro"
            ? proButtonLabel
            : !isOnboarding && selectedPlan === "free"
              ? "Select a plan to upgrade"
              : freeButtonLabel}
        </Button>
      </div>
    </div>
  );
}
