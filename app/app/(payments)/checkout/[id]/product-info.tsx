import { CHECKOUT_CURRENCY, CHECKOUT_CURRENCY_SYMBOL } from "@/app/config/checkout";
import { Tier } from "@/app/generated/prisma";
import { getShortenedCadence } from "@/app/services/billing/connect-checkout-service";
import { TierDescriptionFeatures } from "@/components/tiers/tier-description-features";
import { Separator } from "@/components/ui/separator";
import { parseTierDescription } from "@/lib/utils";
import { type VendorProfile } from "@/types/checkout";
import { Store } from "lucide-react";
import { BrandBadge } from "./brand-badge";

interface ProductInfoProps {
  tier: Tier;
  vendor: VendorProfile | null;
  isAnnual: boolean;
}

export function ProductInfo({ tier, vendor, isAnnual }: ProductInfoProps) {
  const checkoutPrice = isAnnual ? tier.priceAnnual : tier.price;
  const shortenedCadence = getShortenedCadence(isAnnual ? "year" : tier.cadence);
  const trialDays = tier.trialDays || 0;
  const trialOffered = trialDays > 0;
  const parsedDescription = parseTierDescription(tier.description || "");

  return (
    <div className="left-0 top-0 flex size-full flex-col justify-between gap-6 bg-stone-200/70 p-6 pb-9 pt-4 sm:gap-12 sm:px-9 sm:pt-6 lg:fixed lg:w-1/3 xl:p-16 xl:pt-12">
      <div className="flex flex-col gap-9 lg:gap-12">
        <div className="flex items-center gap-3">
          <div className="flex size-7 items-center justify-center rounded bg-white text-stone-600 shadow-border">
            <Store size={16} />
          </div>
          <span className="font-semibold tracking-tightish">{vendor?.name}</span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 xl:gap-3">
            <span className="text-md font-semibold text-stone-500 xl:text-xl/8">
              {tier.name} {isAnnual ? "(annual)" : ""}
            </span>

            <h1 className="text-4xl font-semibold tracking-tight xl:text-5xl">
              {tier.checkoutType === "gitwallet" ? (
                <>
                  {CHECKOUT_CURRENCY + " " + CHECKOUT_CURRENCY_SYMBOL + checkoutPrice}
                  {tier.cadence !== "once" ? (
                    <span className="text-3xl font-normal opacity-40 xl:text-4xl">
                      /{shortenedCadence}
                    </span>
                  ) : null}
                </>
              ) : (
                <span className="-ml-0.5">Get in touch</span>
              )}
            </h1>

            {tier.checkoutType === "gitwallet" ? (
              trialOffered && tier.cadence !== "once" ? (
                <p className="mt-1 text-sm text-stone-500 xl:text-base">
                  Starts with a{" "}
                  <strong className="font-medium text-stone-800">{trialDays} day</strong> free trial
                </p>
              ) : null
            ) : (
              <p className="mt-1 text-sm text-stone-500 xl:text-base">
                Please provide your details so we can reach out.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <Separator className="bg-stone-300/75" />

            <div className="flex flex-col gap-4">
              {parsedDescription.map((section, dex) => {
                if (section.text) {
                  return (
                    <div key={dex}>
                      {section.text.map((text: string, index: number) => (
                        <p
                          key={index}
                          className="text-sm tracking-tightish text-stone-500 xl:text-base"
                        >
                          {text}
                        </p>
                      ))}
                    </div>
                  );
                }

                return (
                  <TierDescriptionFeatures
                    key={dex}
                    features={section.features.map((feature: string, index: number) => ({
                      id: index,
                      name: feature
                    }))}
                    darkMode={false}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <BrandBadge className="hidden lg:inline-flex" />
    </div>
  );
}
