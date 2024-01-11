import Image from "next/image";
import { Col, Grid, Badge, Card, Divider, TextInput, Switch, Button } from "@tremor/react";
import { Accordion, AccordionBody, AccordionHeader } from "@tremor/react";


// Define a type for the testimonial props, including the logo


const logoPath = "/";
// A simple component to display each testimonial with a logo

const checkoutPrice = "10";
const checkoutCurrency = "USD";
const checkoutMaintainer = "Joe Maintainer";
const checkoutProject = "Nokogiri";
const projectDescription = "Nokogiri is an HTML, XML, SAX, and Reader parser. Among Nokogiri's many features is the ability to search documents via XPath or CSS3 selectors. XML is like violence - if it doesn’t solve your problems, you are not using enough of it.";
const checkoutTier = "Premium";

const renderSectionHeading = (text: string) => {
  return (
    <h3 className="text-2xl font-semibold mb-4">{text}</h3>
  );
};


export default function Checkout() {

  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      {/* Left Column */}
      <div className="md:fixed top-0 left-0 w-full md:w-1/2 h-full bg-slate-800 text-slate-50 flex flex-col justify-center p-8 lg:py-32 xl:px-32" style={{ backgroundImage: "url(/voronoi.png)" }}>
        <div className="overflow-y-auto">
          <div className="w-7/8 lg:w-5/6">
            <h1 className="text-4xl font-semibold mb-8">{checkoutProject}</h1>
            <p className="text-xl font-extralight leading-6 mb-6">{projectDescription}</p>
            <Image alt="Gitwallet" src="/logo-white.png" height={0} width={100} className="my-12" />
            {/* <h1 className="text-xl font-light leading-8 mb-6">The business builder made for open source maintainers.</h1> */}
            <div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-1/2 ml-auto bg-slate-100 text-slate-800 overflow-y-auto p-8 md:p-16">
        <section className="mb-8 w-7/8 lg:w-5/6">
          <div className="text-lg font-medium leading-6 mb-2">
            {checkoutProject}: {checkoutTier}
          </div>

          <div className="text-sm font-light leading-6 mb-4">
            {checkoutCurrency + " " + checkoutPrice} per month
          </div>
          <Accordion className="my-2">
            <AccordionHeader className="my-0 py-1">Expand for Tier Details</AccordionHeader>
            <AccordionBody>
              These are all the awesome tier features.
              These are all the awesome tier features.
              These are all the awesome tier features.
              These are all the awesome tier features.
            </AccordionBody>
          </Accordion>

          {/* accept terms of service */}
          <div className="flex flex-row items-center gap-2">
            <label className="text-sm font-light leading-6 mb-4">Nokogiri uses the <a href="#" className="underline">Standard Gitwallet MSA</a>.</label>
          </div>

        </section>



        <section className="mb-8 w-7/8 lg:w-5/6">
          <Divider>Register</Divider>

          {/* {renderSectionHeading("Purpose built for Maintainers")} */}
          <Card>
              <div className="items-center mb-4">
                <TextInput placeholder="Name" />
              </div>
            <div className="items-center mb-4">
              <TextInput placeholder="Work Email" />
            </div>
            <div className="items-center">
              <TextInput placeholder="Company" />
            </div>

          </Card>
        </section>


        <section className="mb-8 w-7/8 lg:w-5/6">
          <Divider>Credit Card Information</Divider>
          <Card>
  
            <div className="mb-4">
              <TextInput placeholder="Credit Card Number" className="mb-4" />

              <div className="flex flex-row gap-4">
                <div className="items-center w-1/2">
                  <TextInput placeholder="Expiry Date (MMYY)" />
                </div>
                <div className="items-center w-1/2 text-xs text-slate-400">
                  <TextInput placeholder="CVV" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-8 w-7/8 lg:w-5/6">
          <Button className="w-full">Checkout</Button>
          <label className="block text-sm text-slate-400 text-center my-2">Your card will be charged {checkoutCurrency + " " + checkoutPrice}</label>
        </section>

      </div>

    </div>
  );
}
