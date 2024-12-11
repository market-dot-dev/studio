import type { SubscriptionCadence } from "@/app/services/StripeService";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import tierPlaceholderData from "@/lib/constants/placeholder/tiers";
import { subscriptionCadenceShorthands } from "@/lib/tiers/subscription-cadence-shorthands";

import type { JSX } from "react";

export default function SkeletonTiers(): JSX.Element {
  return (
    <div className="relative w-full rounded-[38px] border border-dashed border-gray-300 bg-[#FDFDFD] p-8">
      <span className="absolute -top-2 left-1/2 flex h-4 -translate-x-1/2 items-center whitespace-nowrap rounded-full bg-white px-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-500 ring-1 ring-black/10">
        Sample Data
      </span>
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        {tierPlaceholderData.map((tier) => {
          const cadenceShorthand =
            subscriptionCadenceShorthands[tier.cadence as SubscriptionCadence];

          return (
            <div
              key={tier.id}
              className="relative z-10 flex h-full w-full flex-col justify-between gap-8 rounded-md bg-white p-6 pt-5 shadow ring-1 ring-gray-500/10"
            >
              <div>
                <h3 className="mb-1 font-semibold">{tier.name}</h3>
                <p className="text-sm text-gray-500">{tier.tagline}</p>
                <p className="my-5 text-4xl">
                  <span className="font-geist-mono">${tier.price}</span>
                  {cadenceShorthand && (
                    <span className="text-base font-normal text-gray-500">
                      /{cadenceShorthand}
                    </span>
                  )}
                </p>
                <ul className="flex flex-col gap-1">
                  {tier.features.map((feature: any) => (
                    <li
                      key={feature.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="h-5 w-5 text-emerald-600" />
                      <p className="text-gray-500">{feature.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="#"
                className="inline-flex w-full items-center justify-center rounded-md bg-gradient-to-b from-gray-800 to-gray-950 px-3 py-2 text-center text-sm font-medium text-white shadow-sm ring-1 ring-black/5 transition-shadow hover:bg-gray-700 hover:shadow"
              >
                {tier.name === "Enterprise Solution"
                  ? "Contact us"
                  : "Buy package"}
              </a>
            </div>
          );
        })}
      </div>
      <div className="absolute -bottom-2 left-1/2 col-span-full -translate-x-1/2 bg-gradient-to-b from-[#FDFDFD] to-white px-2">
        <Link
          href="/tiers"
          className="group flex items-center gap-0.5 text-xs font-medium tracking-tight text-gray-500 hover:text-gray-600"
        >
          Set up your packages
          <ChevronRight className="-mr-[3px] mt-px h-3 w-3 transition-transform group-hover:translate-x-px group-focus:translate-x-px" />
        </Link>
      </div>
    </div>
  );
}
