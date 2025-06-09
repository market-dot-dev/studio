"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const features = [
  "Offer subscriptions & one-time sales",
  "Custom landing page",
  "Lead capture forms",
  "Custom market.dev domain",
  "Beautiful checkout pages",
  "Customizable embeds",
  "Contract library access",
  "Prospect & customer CRM",
  "Sales analytics dashboard"
];

type PlanType = "free" | "pro";

export default function PricingContent() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("free");
  const router = useRouter();

  const handlePlanSelect = (plan: PlanType) => {
    setSelectedPlan(plan);
  };

  const handleContinue = () => {
    // TODO: Save the selected plan to the organization
    console.log(`Selected plan: ${selectedPlan}`);

    // Continue to completion
    router.push("/onboarding/complete");
  };

  return (
    <div className="relative space-y-10">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Finally, Choose Your Plan</h1>
        <p className="text-sm text-muted-foreground">
          Start for free or upgrade to Pro for advanced features and priority support.
        </p>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6 md:flex-nowrap">
        {/* Free Plan */}
        <div className="w-full max-w-[400px]">
          <Card
            className={`cursor-pointer transition-all duration-200 ${
              selectedPlan === "free"
                ? "shadow-border-md ring-4 ring-swamp"
                : "shadow-border hover:shadow-border-md"
            }`}
            onClick={() => handlePlanSelect("free")}
          >
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Free</h3>
                <p className="text-sm text-muted-foreground">
                  For freelancers just getting started
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight">$0</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </div>

              <div className="mb-6 space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2">
                <CreditCard className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">$0.25 transaction fee + 1% per sale</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Pro Plan */}
        <div className="w-full max-w-[400px]">
          <Card
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedPlan === "pro"
                ? "shadow-border-md ring-4 ring-swamp"
                : "shadow-border hover:shadow-border-md"
            }`}
            onClick={() => handlePlanSelect("pro")}
          >
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Pro</h3>
                <p className="text-sm text-muted-foreground">
                  For established freelances & dev shops
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight">$40</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </div>

              <div className="mb-6 space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2">
                <CreditCard className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  $0.25 transaction fee (0% commission fee)
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 bg-stone-150 py-4 md:static">
        <div className="mx-auto flex max-w-md flex-col gap-3">
          <Button onClick={handleContinue} className="w-full">
            {selectedPlan === "free" ? "Continue with Free" : "Continue with Pro"}
          </Button>
        </div>
      </div>
    </div>
  );
}
