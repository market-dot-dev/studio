"use client";

import RegistrationSection from "./registration-section";
import useTier from "@/app/hooks/use-tier";
import useUser from "@/app/hooks/use-user";
import useFeatures from "@/app/hooks/use-features";
import TierFeatureList from "@/components/features/tier-feature-list";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface QueryParams {
  [key: string]: string | string[] | undefined;
}

const checkoutCurrency = "USD";
const checkoutCurrencySymbol = "$";

import Image from "next/image";
import useContract from "@/app/hooks/use-contract";
import { parseTierDescription } from "@/lib/utils";
import { Store } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const TierNotAvailable = () => {
  return (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">404</h1>
      <Image
        alt="tier not active"
        src="https://illustrations.popsy.co/gray/falling.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">Tier not available</p>
    </div>
  );
};

const CheckoutPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const searchParams = useSearchParams();
  const queryParams: QueryParams = Object.fromEntries(searchParams.entries());
  const isAnnual = queryParams.annual === "true";

  const [tier, isTierLoading] = useTier(id);
  const [contract, isContractLoading] = useContract(
    tier?.contractId || undefined,
  );
  const [maintainer, isMaintainerLoading, hasActiveFeatures] = useUser(
    tier?.userId,
  );
  const [features, isFeaturesLoading] = useFeatures(id);

  // Derived loading states that account for dependencies
  const isEffectiveMaintainerLoading = useMemo(() => 
    isTierLoading || (tier?.userId && isMaintainerLoading), 
    [isTierLoading, tier?.userId, isMaintainerLoading]
  );
  
  const isEffectiveContractLoading = useMemo(() => 
    isTierLoading || (tier?.contractId && isContractLoading), 
    [isTierLoading, tier?.contractId, isContractLoading]
  );

  const isEffectiveFeaturesLoading = useMemo(() => 
    isTierLoading || isFeaturesLoading, 
    [isTierLoading, isFeaturesLoading]
  );

  const checkoutType = tier?.checkoutType;
  const checkoutProject = maintainer?.projectName || maintainer?.name;
  const checkoutPrice = isAnnual ? tier?.priceAnnual : tier?.price;
  const checkoutTier = tier?.name;
  const checkoutCadence = isAnnual ? "year" : tier?.cadence;
  const trialDays = tier?.trialDays || 0;
  const trialOffered = trialDays > 0;

  const shortenedCadence = useMemo(() => {
    if (checkoutCadence === "month") return "mo";
    if (checkoutCadence === "year") return "yr";
    return checkoutCadence;
  }, [checkoutCadence]);

  if (tier?.id && !tier?.published) {
    return TierNotAvailable();
  }

  const directlyProvidedFeatures = !!features && features.length > 0;
  const tierFeatures = directlyProvidedFeatures ? features : [];
  const parsedDescription = parseTierDescription(tier?.description || "");

  return (
    <div className="flex min-h-screen flex-col text-stone-800 lg:flex-row">
      {/* Left Column */}
      <div className="left-0 top-0 flex h-full w-full flex-col justify-between gap-6 bg-stone-200/80 p-6 pb-9 pt-4 sm:gap-12 sm:px-9 sm:pt-6 lg:fixed lg:w-2/5 xl:p-16 xl:pt-12">
        <div className="flex flex-col gap-9 lg:gap-12">
          <div className="flex items-center gap-3">
            <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-b from-stone-800/90 to-stone-800 text-white/85">
              <Store size={18} className="h-[15px]" />
            </div>
            {isEffectiveMaintainerLoading ? (
              <Skeleton className="h-5 w-36" />
            ) : (
              <span className="font-bold tracking-tightish">
                {checkoutProject}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 xl:gap-3">
              {isTierLoading ? (
                <Skeleton className="mb-1 h-6 w-full max-w-48 xl:h-7" />
              ) : (
                <span className="text-md font-semibold text-stone-500 xl:text-xl/8">
                  {checkoutTier} {isAnnual ? "(annual)" : ""}
                </span>
              )}

              {isTierLoading ? (
                <Skeleton className="h-10 w-full max-w-72 xl:h-12" />
              ) : (
                <h1 className="text-4xl font-semibold tracking-tight xl:text-5xl">
                  {checkoutType === "gitwallet" ? (
                    <>
                      {checkoutCurrency +
                        " " +
                        checkoutCurrencySymbol +
                        checkoutPrice}
                      {checkoutCadence !== "once" ? (
                        <span className="font-semibold text-stone-400">
                          /{shortenedCadence}
                        </span>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <span className="-ml-0.5">Get in touch</span>
                  )}
                </h1>
              )}

              {isTierLoading ? (
                <Skeleton className="mt-1 h-5 w-3/4 xl:h-6" />
              ) : (
                <>
                  {checkoutType === "gitwallet" ? (
                    trialOffered && tier?.cadence !== "once" ? (
                      <p className="mt-1 text-sm font-semibold tracking-tightish text-stone-500 xl:text-base">
                        Starts with a{" "}
                        <strong className="font-bold text-stone-800">
                          {trialDays} day
                        </strong>{" "}
                        free trial
                      </p>
                    ) : null
                  ) : (
                    <p className="mt-1 text-sm font-medium text-stone-500 xl:text-base">
                      Please provide your details so we can reach out.
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col gap-6 overflow-y-scroll">
              {isEffectiveFeaturesLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-4/6" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              ) : hasActiveFeatures && tierFeatures.length !== 0 ? (
                <>
                  <Separator className="bg-stone-300/50" />
                  <TierFeatureList features={tierFeatures} />
                </>
              ) : (
                <>
                  <Separator className="bg-stone-300/50" />

                  {!isTierLoading &&
                    parsedDescription.map((section, dex) => {
                      if (section.text) {
                        return (
                          <div key={dex}>
                            {section.text.map((text: string, index: number) => (
                              <p
                                key={index}
                                className="max-w-prose text-pretty text-sm text-stone-500"
                              >
                                {text}
                              </p>
                            ))}
                          </div>
                        );
                      }

                      return (
                        <TierFeatureList
                          key={dex}
                          features={section.features.map(
                            (feature: string, index: number) => ({
                              id: `${index}`,
                              name: feature,
                              isEnabled: true,
                            }),
                          )}
                        />
                      );
                    })}
                </>
              )}
            </div>
          </div>
        </div>
        <p className="absolute right-6 top-5 inline-flex gap-2 text-sm font-semibold tracking-tight text-stone-500 sm:right-9 sm:top-7 lg:static">
          <span className="hidden sm:inline">Powered by</span>
          <Link href="https://market.dev" target="_blank">
            <Image
              alt="market.dev logo"
              width={72}
              height={16}
              className="inline h-5 w-auto -translate-y-px sm:h-[19px]"
              src="/market-dot-dev-logo.svg"
            />
          </Link>
        </p>
      </div>

      {/* Right Column */}
      <div className="ml-auto flex min-h-[80vh] w-full flex-col items-center overflow-y-auto bg-stone-100 px-6 py-9 text-stone-800 sm:p-9 lg:w-3/5 lg:p-16 lg:pt-32">
        {isEffectiveMaintainerLoading || isEffectiveContractLoading ? (
          <div className="mx-auto mt-1 flex w-full flex-col items-start gap-6 opacity-50 lg:max-w-lg">
            <div className="w-full space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="mt-4 h-10 w-full" />
          </div>
        ) : (
          <>
            {tier && maintainer && (
              <RegistrationSection
                tier={tier}
                maintainer={maintainer}
                contract={contract}
                annual={isAnnual}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
