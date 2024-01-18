"use client";

import Image from "next/image";
import { Accordion, AccordionBody, AccordionHeader } from "@tremor/react";
import { CurrentSessionProvider } from "@/app/contexts/current-user-context";
import RegistrationSection from "./registration-section";
import useTier from "@/app/hooks/use-tier";
import useUser from "@/app/hooks/use-user";

const checkoutCurrency = "USD";
const projectDescriptionDefault =
  "Nokogiri is an HTML, XML, SAX, and Reader parser. Among Nokogiri's many features is the ability to search documents via XPath or CSS3 selectors. XML is like violence - if it doesn’t solve your problems, you are not using enough of it.";

const renderSectionHeading = (text: string) => {
  return <h3 className="mb-4 text-2xl font-semibold">{text}</h3>;
};

const CheckoutPage = ({params} : {params: { id: string }}) => {
  const { id } = params;

  const [tier] = useTier(id);
  const [maintainer] = useUser(tier?.userId);

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
            <h1 className="mb-8 text-4xl font-semibold">{checkoutProject}</h1>
            <p className="mb-6 text-xl font-extralight leading-6">
              {projectDescription}
            </p>
            <Image
              alt="Gitwallet"
              src="/logo-white.png"
              height={0}
              width={100}
              className="my-12"
            />
            {/* <h1 className="text-xl font-light leading-8 mb-6">The business builder made for open source maintainers.</h1> */}
            <div></div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="ml-auto w-full overflow-y-auto bg-slate-100 p-8 text-slate-800 md:w-1/2 md:p-16">
        <section className="w-7/8 mb-8 lg:w-5/6">
          <div className="mb-2 text-lg font-medium leading-6">
            {checkoutProject}: {checkoutTier}
          </div>

          <div className="mb-4 text-sm font-light leading-6">
            {checkoutCurrency + " " + checkoutPrice} per month
          </div>
          <Accordion className="my-2">
            <AccordionHeader className="my-0 py-1">
              Expand for Tier Details
            </AccordionHeader>
            <AccordionBody>
              These are all the awesome tier features. These are all the awesome
              tier features. These are all the awesome tier features. These are
              all the awesome tier features.
            </AccordionBody>
          </Accordion>

          {/* accept terms of service */}
          <div className="flex flex-row items-center gap-2">
            <label className="mb-4 text-sm font-light leading-6">
              Nokogiri uses the{" "}
              <a href="#" className="underline">
                Standard Gitwallet MSA
              </a>
              .
            </label>
          </div>
        </section>

        <CurrentSessionProvider>
          <RegistrationSection tierId={id} />
        </CurrentSessionProvider>
      </div>
    </div>
  );
}


export default CheckoutPage;