import type { SubscriptionCadence } from "@/app/services/stripe/stripe-price-service";
import tierPlaceholderData from "@/lib/constants/placeholder/tiers";
import { subscriptionCadenceShorthands } from "@/lib/tiers/subscription-cadence-shorthands";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function SkeletonTiers({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center rounded-[38px] border border-dashed border-gray-300 bg-[#FDFDFD] p-8",
        className
      )}
    >
      <div className="mb-8 flex h-4 items-center whitespace-nowrap rounded-full bg-white px-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-500 ring-1 ring-black/10">
        Sample Data
      </div>

      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        {tierPlaceholderData.map((tier) => {
          const cadenceShorthand =
            subscriptionCadenceShorthands[tier.cadence as SubscriptionCadence];

          return (
            <div
              key={tier.id}
              className="flex size-full flex-col justify-between gap-8 rounded-md bg-white p-6 pt-5 shadow ring-1 ring-gray-500/10"
            >
              <div>
                <h3 className="mb-1 font-semibold">{tier.name}</h3>
                <p className="text-sm text-gray-500">{tier.tagline}</p>
                <p className="my-5 text-4xl">
                  <span className="font-mono">${tier.price}</span>
                  {cadenceShorthand && (
                    <span className="text-base font-normal text-gray-500">/{cadenceShorthand}</span>
                  )}
                </p>
              </div>
              <Button>
                {tier.name === "Enterprise Solution" ? "Get in touch" : "Buy package"}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center bg-gradient-to-b from-[#FDFDFD] to-white px-2">
        <Link
          href="/tiers"
          className="group flex items-center gap-0.5 text-xs font-medium tracking-tight text-gray-500 hover:text-gray-600"
        >
          Set up your packages
          <ChevronRight className="mr-[-3px] mt-px size-3 transition-transform group-hover:translate-x-px group-focus:translate-x-px" />
        </Link>
      </div>
    </div>
  );
}
