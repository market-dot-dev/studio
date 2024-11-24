"use client";

import { Accordion, AccordionBody, AccordionHeader, Flex } from "@tremor/react";
import RegistrationSection from "./registration-section";
import useTier from "@/app/hooks/use-tier";
import useUser from "@/app/hooks/use-user";
import useFeatures from "@/app/hooks/use-features";
import TierFeatureList from "@/components/features/tier-feature-list";
import { Text, Bold, Card } from "@tremor/react";

import { useSearchParams } from "next/navigation";

interface QueryParams {
  [key: string]: string | string[] | undefined;
}

const checkoutCurrency = "USD";
const projectDescriptionDefault = "";

import Image from "next/image";
import useContract from "@/app/hooks/use-contract";
import LoadingDots from "@/components/icons/loading-dots";
import { Contract } from "@prisma/client";
import { parseTierDescription } from "@/lib/utils";

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

const ContractText = ({
  checkoutProject,
  contract,
}: {
  checkoutProject: string;
  contract?: Contract;
}) => {
  const pathToDefaultMSA = "https://app.gitwallet.co/c/contracts/gitwallet-msa";

  if (!contract) {
    return (
      <>
        {checkoutProject} uses the{" "}
        <a href={pathToDefaultMSA} className="underline" target="_blank">
          Standard Gitwallet MSA
        </a>
        .
      </>
    );
  }

  const url = `https://app.gitwallet.co/c/contracts/${contract.id}`;

  return (
    <>
      {checkoutProject} uses the{" "}
      <a href={url} className="underline" target="_blank">
        {contract?.name}
      </a>
      .
    </>
  );
};

const SkeletonLoader = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-300 ${className}`}></div>
);

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

  const checkoutProject = maintainer?.projectName || maintainer?.name;
  const projectDescription =
    maintainer?.projectDescription || projectDescriptionDefault;
  const checkoutPrice = isAnnual ? tier?.priceAnnual : tier?.price;
  const checkoutTier = tier?.name;
  const checkoutCadence = isAnnual ? "year" : tier?.cadence;
  const trialDays = tier?.trialDays || 0;
  const trialOffered = trialDays > 0;

  if (tier?.id && !tier?.published) {
    return TierNotAvailable();
  }

  const featuresFromDescription =
    !isTierLoading && tier?.description
      ? parseTierDescription(tier.description)
          .filter((section) => section.features)
          .map((section) => section.features)
          .flat()
      : [];

  const tierInfo = (
    <Card>
      <Text>Package Details</Text>
      {isTierLoading ? (
        <div className="opacity-50">
          <SkeletonLoader className="mb-2 h-4 w-3/5 rounded-full leading-6" />
          <SkeletonLoader className="mb-4 h-4 w-1/2 rounded-full leading-6" />
        </div>
      ) : (
        <div>
          <div className="mb-2 text-lg">
            <Bold className="text-gray-800">
              {checkoutProject}: {checkoutTier} {isAnnual ? `(annual)` : ""}
            </Bold>
          </div>
          <div className="mb-2 text-lg leading-6">
            <Text>
              {checkoutCurrency + " " + checkoutPrice}{" "}
              {checkoutCadence !== "once" ? `per ${checkoutCadence}` : ""}
              {trialOffered && <>&nbsp;with {trialDays}d free trial</>}
            </Text>
          </div>
        </div>
      )}

      {isFeaturesLoading ? (
        <SkeletonLoader className="my-2 h-8 w-full rounded-xl" />
      ) : (
        <Accordion className="my-2">
          <AccordionHeader className="my-0 py-1">
            Package Benefits
          </AccordionHeader>
          <AccordionBody>
            {hasActiveFeatures ? (
              features ? (
                <TierFeatureList features={features || []} />
              ) : (
                <Text>No features have been listed in this package.</Text>
              )
            ) : featuresFromDescription.length ? (
              <TierFeatureList
                features={featuresFromDescription.map(
                  (feature: string, index: number) => ({
                    id: `${index}`,
                    name: feature,
                    isEnabled: true,
                  }),
                )}
              />
            ) : (
              <Text>No features have been listed in this package.</Text>
            )}
          </AccordionBody>
        </Accordion>
      )}

      {/* accept terms of service */}
      <div className="flex flex-row items-center gap-2">
        {isFeaturesLoading ? (
          <SkeletonLoader className="mb-4 h-4 w-3/4 rounded-full" />
        ) : (
          <Text className="mb-4 leading-6">
            {isContractLoading && !(tier?.id && !tier.contractId) ? (
              <LoadingDots />
            ) : (
              <ContractText
                checkoutProject={checkoutProject || ""}
                contract={contract}
              />
            )}
          </Text>
        )}
      </div>
    </Card>
  );

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Column */}
      <div
        className="left-0 top-0 flex h-full w-full flex-col justify-center bg-slate-800 px-8 sm:py-8 md:fixed md:w-2/5"
        // style={{ backgroundImage: "url(/voronoi.png)" }}
      >
        <div className="overflow-y-auto">
          <div className="w-7/8">
            {isMaintainerLoading ? (
              <Flex
                flexDirection="col"
                alignItems="start"
                className="mb-6 gap-10 opacity-50"
              >
                <SkeletonLoader className="h-6 w-3/4 rounded-xl" />
                <Flex flexDirection="col" alignItems="start" className="gap-2">
                  <SkeletonLoader className="h-4 w-full rounded-full" />
                  <SkeletonLoader className="h-4 w-1/2 rounded-full" />
                </Flex>
              </Flex>
            ) : (
              <>
                <h1 className="mb-8 text-4xl font-semibold text-slate-50">
                  {checkoutProject}
                </h1>
                {tierInfo}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="ml-auto w-full overflow-y-auto bg-white p-8 text-slate-800 md:w-3/5 md:p-16">
        {isTierLoading ? (
          <>
            <Flex
              flexDirection="col"
              alignItems="start"
              className="gap-12 opacity-50"
            >
              <SkeletonLoader className="h-16 w-5/6 rounded-xl" />
              <SkeletonLoader className="h-36 w-5/6 rounded-xl" />
              <SkeletonLoader className="h-12 w-5/6 rounded-xl" />
            </Flex>
          </>
        ) : (
          <>
            {tier && maintainer && (
              <RegistrationSection
                tier={tier}
                maintainer={maintainer}
                annual={isAnnual}
                contactUsCheckout={true}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
