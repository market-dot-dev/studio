import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const pricingFeatures = [
  "Offer subscriptions & one-time sales",
  "Custom market.dev domain",
  "Prospect & customer CRM",
  "Sales analytics dashboard",
  "Beautiful checkout pages",
  "Contract library access",
  "Customizable embeds",
  "Custom landing page",
  "Lead capture forms"
];

export function FeatureItem({ feature }: { feature: string }) {
  return (
    <div className="flex items-start gap-2">
      <Check className="mt-0.5 size-4 shrink-0 text-success" />
      <span className="text-sm text-muted-foreground">{feature}</span>
    </div>
  );
}

export function SharedFeatureList({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      {pricingFeatures.map((feature) => (
        <FeatureItem key={feature} feature={feature} />
      ))}
    </div>
  );
}
