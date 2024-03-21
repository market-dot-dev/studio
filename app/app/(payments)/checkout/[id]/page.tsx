"use client";

import Image from "next/image";
import { Accordion, AccordionBody, AccordionHeader, Badge, Flex } from "@tremor/react";
import { CurrentSessionProvider } from "@/app/contexts/current-user-context";
import RegistrationSection from "./registration-section";
import useTier from "@/app/hooks/use-tier";
import useUser from "@/app/hooks/use-user";
import useFeatures from "@/app/hooks/use-features";
import TierFeatureList from "@/components/features/tier-feature-list";
import { Text, Bold } from "@tremor/react";

const checkoutCurrency = "USD";
const projectDescriptionDefault = "";
const pathToDefaultMSA = "https://www.gitwallet.co/legal/standard-msa";

const renderSectionHeading = (text: string) => {
  return <h3 className="mb-4 text-2xl font-semibold">{text}</h3>;
};

const SkeletonLoader = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-300 ${className}`}></div>
);

const CheckoutPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [tier, isTierLoading] = useTier(id);
  const [maintainer, isMaintainerLoading] = useUser(tier?.userId);
  const [features, isFeaturesLoading] = useFeatures(id);

  const checkoutMaintainer = maintainer?.name;
  const checkoutProject = maintainer?.projectName || maintainer?.name;
  const projectDescription = maintainer?.projectDescription || projectDescriptionDefault;
  const checkoutPrice = tier?.price;
  const checkoutTier = tier?.name;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Column */}
      <div
        className="left-0 top-0 flex h-full w-full flex-col justify-center bg-slate-800 p-8 text-slate-50 md:fixed md:w-1/2 lg:py-32 xl:px-32"
        style={{ backgroundImage: "url(/voronoi.png)" }}
      >
        <div className="overflow-y-auto">
          <div className="w-7/8 lg:w-5/6">
            {isMaintainerLoading ?
              <Flex flexDirection="col" alignItems="start" className='gap-10 mb-6 opacity-50'>
                <SkeletonLoader className="h-6 w-3/4 rounded-xl" />
                <Flex flexDirection="col" alignItems="start" className='gap-2'>
                  <SkeletonLoader className="h-4 w-full rounded-full" />
                  <SkeletonLoader className="h-4 w-1/2 rounded-full" />
                </Flex>
              </Flex>
              :
              <>
                <h1 className="mb-8 text-4xl font-semibold">{checkoutProject}</h1>
                <p className="mb-8 text-xl font-extralight leading-6">
                  {projectDescription}
                </p>
              </>
            }
            <div></div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="ml-auto w-full overflow-y-auto bg-slate-100 p-8 text-slate-800 md:w-1/2 md:p-16">
        <section className="w-7/8 mb-8 lg:w-5/6">
          {isTierLoading ?
            <div className="opacity-50">
              <SkeletonLoader className="h-4 w-3/5 rounded-full leading-6 mb-2" />
              <SkeletonLoader className="h-4 w-1/2 rounded-full leading-6 mb-4" />
            </div>
            :
            <div>
              <div className="mb-2 text-lg font-medium leading-6">
                <Bold>{checkoutProject}: {checkoutTier}</Bold>
              </div>
              <div className="mb-4 leading-6">
                <Text>{checkoutCurrency + " " + checkoutPrice} per month</Text>
              </div>
            </div>
          }

          {isFeaturesLoading ?
            <SkeletonLoader className="h-8 w-full rounded-xl my-2" /> 
            :
            <Accordion className="my-2">
              <AccordionHeader className="my-0 py-1">
                Expand for Tier Details
              </AccordionHeader>
              <AccordionBody>
                <TierFeatureList features={features || []} />
              </AccordionBody>
            </Accordion>
          }

          {/* accept terms of service */}
          <div className="flex flex-row items-center gap-2">
            {isFeaturesLoading ?
              <SkeletonLoader className="h-4 w-3/4 rounded-full mb-4" /> :

              <Text className="mb-4 leading-6">
                {checkoutProject} uses the{" "}
                <a href={pathToDefaultMSA} className="underline" target="_blank">
                  Standard Gitwallet MSA
                </a>
                .
              </Text>
            }
          </div>
        </section>

        <CurrentSessionProvider>
          {isTierLoading ?
            <>
              <Flex flexDirection="col" alignItems="start" className='gap-12 opacity-50'>
                <SkeletonLoader className="h-16 w-5/6 rounded-xl" />
                <SkeletonLoader className="h-36 w-5/6 rounded-xl" />
                <SkeletonLoader className="h-12 w-5/6 rounded-xl" />
              </Flex>

            </> :
            <>
              {tier && maintainer && <RegistrationSection tier={tier} maintainer={maintainer}/>}
            </>
          }
        </CurrentSessionProvider>
      </div>
    </div>
  );
}


export default CheckoutPage;