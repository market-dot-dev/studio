import { getCachedPricing } from "@/app/services/platform";
import Section from "@/components/home/section";
import { PricingTable } from "@/components/pricing/pricing-table";
import { colors } from "@/lib/home/colors";
import { loginURL } from "@/lib/home/social-urls";
import { createPlanConfiguration } from "@/utils/plan-configuration";
import { WalletCards } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Pricing() {
  const pricingData = await getCachedPricing();

  async function handlePlanSelection() {
    "use server";
    redirect(loginURL);
  }

  // Create plan configuration for marketing context
  const plans = createPlanConfiguration({
    context: "marketing",
    includeCustomPlan: true
  });

  return (
    <Section
      id="pricing"
      badge={{
        icon: <WalletCards />,
        title: "Plans"
      }}
      color={colors.green["100"]}
      headline="Simple Pricing"
      description="Choose the plan that works best for your business. Start for free and upgrade as you grow."
      className="!max-w-none"
    >
      <PricingTable
        pricingData={pricingData}
        plans={plans}
        onSelectFree={handlePlanSelection}
        onSelectPro={handlePlanSelection}
      />
    </Section>
  );
}
