import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const features = [
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

export function FeatureList({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-success" />
          <span className="text-sm text-muted-foreground">{feature}</span>
        </div>
      ))}
    </div>
  );
}
