"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { PlanPricing, PricingData } from "@/types/platform";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface PricingTableProps {
  priceIds: PlanPricing;
  pricingData: PricingData;
  className?: string;
}

interface Feature {
  text: string;
  negate?: boolean;
}

interface PricingTier {
  title: string;
  tagline: string;
  price: string | number;
  features: Feature[];
  priceId: string | null;
  isPopular?: boolean;
  checkoutType: "gitwallet" | "contact";
}

const FeatureList = ({
  features,
  darkMode = false
}: {
  features: Feature[];
  darkMode?: boolean;
}) => (
  <div className="flex flex-col gap-3">
    {features.map((feature, index) => (
      <div key={index} className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
            feature.negate ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
          )}
        >
          {feature.negate ? <X className="size-3" /> : <Check className="size-3" />}
        </div>
        <p
          className={cn(
            "text-sm",
            feature.negate ? "text-stone-400 line-through" : "text-stone-600",
            darkMode && (feature.negate ? "text-stone-500" : "text-stone-300")
          )}
        >
          {feature.text}
        </p>
      </div>
    ))}
  </div>
);

const PricingCard = ({
  tier,
  isAnnual,
  darkMode = false
}: {
  tier: PricingTier;
  isAnnual: boolean;
  darkMode?: boolean;
}) => {
  const containerClasses = darkMode ? "text-white bg-stone-900" : "text-stone-900 bg-white";
  const headingClasses = darkMode ? "text-white" : "text-stone-900";
  const textClasses = darkMode ? "text-stone-300" : "text-stone-500";

  const renderPrice = () => {
    if (typeof tier.price === "string") {
      return (
        <p className="h-fit text-4xl">
          <span className="tracking-tight">{tier.price}</span>
        </p>
      );
    }

    return (
      <p className="h-fit text-4xl">
        <span className="tracking-tight">${tier.price}</span>
        <span
          className={cn("text-base/10 font-normal", darkMode ? "text-stone-500" : "text-stone-400")}
        >
          <span className="mr-px">/</span>mo
        </span>
      </p>
    );
  };

  const renderButton = () => {
    if (tier.checkoutType === "contact") {
      return (
        <Button
          variant="secondary"
          className={cn("w-full", darkMode && "!bg-white !text-stone-800 hover:bg-stone-100")}
        >
          Contact Sales
        </Button>
      );
    }

    if (tier.priceId) {
      return (
        <Button
          className={cn("w-full", darkMode && "!bg-white !text-stone-800 hover:bg-stone-100")}
        >
          Get Started
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        className={cn("w-full", darkMode && "border-stone-600 !text-white hover:bg-stone-800")}
      >
        Current Plan
      </Button>
    );
  };

  return (
    <Card
      className={cn(
        "relative flex size-full flex-col justify-between p-6 pt-5",
        containerClasses,
        tier.isPopular && "ring-2 ring-blue-500"
      )}
    >
      {tier.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
          Most Popular
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <h3 className={cn("mb-1 text-lg font-semibold", headingClasses)}>{tier.title}</h3>
          <p className={cn("text-sm", textClasses)}>{tier.tagline}</p>
        </div>

        <div className="flex flex-col gap-1">{renderPrice()}</div>

        <div className="flex flex-col gap-4">
          <FeatureList features={tier.features} darkMode={darkMode} />
        </div>
      </div>

      <div className="mt-8 w-full">{renderButton()}</div>
    </Card>
  );
};

export function PricingTable({ priceIds, pricingData, className }: PricingTableProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const formatPrice = (amount: number, currency: string, isAnnualPrice: boolean = false) => {
    const displayAmount = isAnnualPrice ? amount / 12 : amount;
    return Math.round(displayAmount / 100);
  };

  const tiers: PricingTier[] = [
    {
      title: "Free",
      tagline: "Pay only when you get paid",
      price: "Free",
      checkoutType: "gitwallet",
      priceId: null,
      features: [
        { text: "Core: Landing Pages, CRM, Payments, Contracts" },
        { text: "Basic customer management" },
        { text: "Standard payment processing" },
        { text: "Community support" },
        { text: "1 team member" },
        { text: "Advanced integrations", negate: true },
        { text: "Priority support", negate: true }
      ]
    },
    {
      title: "Paid",
      tagline: "A fixed fee every month",
      price: formatPrice(
        isAnnual ? pricingData.pro_annually.amount : pricingData.pro_monthly.amount,
        isAnnual ? pricingData.pro_annually.currency : pricingData.pro_monthly.currency,
        isAnnual
      ),
      checkoutType: "gitwallet",
      priceId: isAnnual ? priceIds.pro.yearly : priceIds.pro.monthly,
      isPopular: true,
      features: [
        { text: "Everything in Free" },
        { text: "AI-driven project setup" },
        { text: "Unlimited projects" },
        { text: "Unlimited team members" },
        { text: "Advanced customization" },
        { text: "Priority email & chat support" },
        { text: "Advanced analytics & insights" },
        { text: "Custom integrations" }
      ]
    },
    {
      title: "Custom",
      tagline: "Customized for your needs",
      price: "Custom",
      checkoutType: "contact",
      priceId: null,
      features: [
        { text: "Everything in Paid" },
        { text: "White-label solution" },
        { text: "Custom feature development" },
        { text: "Dedicated account manager" },
        { text: "Custom SLA agreements" },
        { text: "On-premise deployment options" },
        { text: "Advanced security features" },
        { text: "24/7 phone support" }
      ]
    }
  ];

  return (
    <div className={className}>
      <div className="mb-8">
        <div className="flex w-full items-center justify-center space-x-3 text-center font-semibold">
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
          Save 20% annually
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {tiers.map((tier) => (
          <PricingCard key={tier.title} tier={tier} isAnnual={isAnnual} darkMode={false} />
        ))}
      </div>
    </div>
  );
}
