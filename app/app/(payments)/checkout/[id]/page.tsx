"use client";

import Image from "next/image";
import { Accordion, AccordionBody, AccordionHeader, Badge, Flex } from "@tremor/react";
import { CurrentSessionProvider } from "@/app/contexts/current-user-context";
import RegistrationSection from "./registration-section";
import useTier from "@/app/hooks/use-tier";
import useUser from "@/app/hooks/use-user";
import useFeatures from "@/app/hooks/use-features";
import TierFeatureList from "@/components/features/tier-feature-list";
import { Text } from "@tremor/react";

const checkoutCurrency = "USD";
const projectDescriptionDefault = "The business builder made for open source maintainers.";

const renderSectionHeading = (text: string) => {
  return <h3 className="mb-4 text-2xl font-semibold">{text}</h3>;
};

const SkeletonLoader = ({ className } : { className?: string}) => (
  <div className={`animate-pulse bg-slate-300 ${className}`}></div>
);

const CheckoutPage = ({params} : {params: { id: string }}) => {
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
                <SkeletonLoader className="h-8 w-3/4" />
                <Flex flexDirection="col" alignItems="start" className='gap-2'>
                  <SkeletonLoader className="h-6 w-full"/>
                  <SkeletonLoader className="h-6 w-full" />
                  <SkeletonLoader className="h-6 w-full" />
                  <SkeletonLoader className="h-6 w-1/2" />
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
            
            <Text className="text-xs mb-1">Powered by:</Text>
            <Image
              alt="Gitwallet"
              src="/logo-white.png"
              height={0}
              width={100}
            />
            {/* <h1 className="text-xl font-light leading-8 mb-6">The business builder made for open source maintainers.</h1> */}
            <div></div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="ml-auto w-full overflow-y-auto bg-slate-100 p-8 text-slate-800 md:w-1/2 md:p-16">
        <section className="w-7/8 mb-8 lg:w-5/6">
          {isTierLoading ? 
            <div className="opacity-50">
              <SkeletonLoader className="h-6 w-3/5 mb-2" />
              <SkeletonLoader className="h-6 w-1/2 mb-4" />
            </div>
           : 
            <div>
              <div className="mb-2 text-lg font-medium leading-6">
                {checkoutProject}: {checkoutTier}
              </div>
              <div className="mb-4 text-sm font-light leading-6">
                {checkoutCurrency + " " + checkoutPrice} per month
              </div>
            </div>
          }
          <Accordion className="my-2">
            <AccordionHeader className="my-0 py-1">
              Expand for Tier Details
            </AccordionHeader>
            <AccordionBody>
            {isFeaturesLoading ? (
              <div className="opacity-50">
                <SkeletonLoader className="h-24 w-full" />
              </div>
            ) : (
              <TierFeatureList features={features || []} />
            )}
            </AccordionBody>
          </Accordion>

          {/* accept terms of service */}
          <div className="flex flex-row items-center gap-2">
            <label className="mb-4 text-sm font-light leading-6">
              {checkoutProject} uses the{" "}
              <a href="#" className="underline">
                Standard Gitwallet MSA
              </a>
              .
            </label>
          </div>
        </section>

        <CurrentSessionProvider>
          { isTierLoading ?
             <>
              
                <Flex flexDirection="col" alignItems="start" className='gap-12 opacity-50'>
                  <SkeletonLoader className="h-16 w-5/6" />
                  <SkeletonLoader className="h-36 w-5/6" />
                  <SkeletonLoader className="h-12 w-5/6" />
                </Flex>
              
            </> :
            <>
            { tier && <RegistrationSection tier={tier} /> }
            </>
            }
        </CurrentSessionProvider>
      </div>
    </div>
  );
}


export default CheckoutPage;