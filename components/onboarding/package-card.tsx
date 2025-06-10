import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export type PackageCardData = {
  name: string;
  tagline: string;
  description: string;
  price: number;
  cadence: "once" | "month";
  checkoutType: "gitwallet" | "contact-form";
};

export function PackageCard({ pkg: tier }: { pkg: PackageCardData }) {
  const cadenceText = (() => {
    switch (tier.cadence) {
      case "once":
        return "";
      case "month":
        return "/mo";
      default:
        return "";
    }
  })();

  return (
    <Card className="flex size-full flex-col justify-between bg-white p-6 pt-5 text-foreground shadow-border">
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="mb-1 text-lg font-semibold">{tier.name}</h3>
          <p className="text-sm text-muted-foreground">{tier.tagline}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="h-fit text-4xl">
            <span className="tracking-tight">${tier.price}</span>
            {cadenceText && (
              <span className="text-base font-normal text-muted-foreground">{cadenceText}</span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {tier.description.split("\n").map((line, index) => (
            <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check strokeWidth={2.25} className="mt-0.5 size-4 shrink-0 text-success" />
              <p className="flex-1">{line.replace("•", "").trim()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 w-full">
        <Button className="w-full disabled:opacity-100" disabled>
          {tier.checkoutType === "gitwallet" ? "Get Started" : "Get in touch"}
        </Button>
      </div>
    </Card>
  );
}
