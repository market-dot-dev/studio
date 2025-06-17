import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { ReactNode } from "react";
import { PlanCheckout } from "./plan-checkout";

interface PricingTableCardProps {
  title: string;
  tagline: string;
  price: string;
  isAnnual: boolean;
  features: { text: string | ReactNode; negate?: boolean }[];
  children?: ReactNode;
  priceId: string | null; // Allow null for FREE plan
}

export function PricingTableCard({
  title,
  tagline,
  price,
  isAnnual,
  features,
  children,
  priceId
}: PricingTableCardProps) {
  return (
    <Card className="flex w-full max-w-[360px] flex-col p-6 text-center shadow-xl md:w-1/2 lg:w-2/5">
      <CardContent className="flex h-full flex-col p-0">
        <h3 className="mb-1 text-xl font-bold text-foreground">{title}</h3>
        <p className="mb-4 text-muted-foreground">{tagline}</p>

        <div className="mb-8 rounded-xl bg-accent p-6 shadow-sm">
          <p className="mb-2 text-4xl font-extrabold text-foreground">
            {price}
            {price !== "Free" && <span className="text-lg font-normal">/mo</span>}
          </p>
          <p className="text-muted-foreground">
            {price === "Free"
              ? "No credit card required"
              : `Billed ${isAnnual ? "annually" : "monthly"}`}
          </p>
        </div>

        {features.length > 0 && (
          <div className="mb-8">
            <ul className="space-y-3 text-left leading-none">
              {features.map((f, i) => (
                <li key={`${title}-${i}`} className="flex items-center">
                  {f.negate ? (
                    <XCircle className="mr-2 size-5 text-destructive" />
                  ) : (
                    <CheckCircle className="mr-2 size-5 text-green-600" />
                  )}
                  <span className="text-foreground">{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {children && <div className="mb-8">{children}</div>}

        <div className="mt-auto">
          <PlanCheckout priceId={priceId} />
        </div>
      </CardContent>
    </Card>
  );
}
