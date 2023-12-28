import Image from "next/image";
import type { NextPage } from 'next';
import SimpleEmailInputForm from "@/components/common/simple-email-input";
import FormButton from "@/components/common/form-button";
import { Card, Col, Grid } from "@tremor/react";
import DashboardCard from "@/components/common/dashboard-card";
import { Accordion, AccordionHeader, AccordionBody, AccordionList } from "@tremor/react";


// Define a type for the testimonial props, including the logo
type TestimonialProps = {
  ecosystem: string;
  logoSrc: string;
};

// A simple component to display each testimonial with a logo
const Testimonial: React.FC<TestimonialProps> = ({ ecosystem, logoSrc }) => (
  <div className="flex items-center space-x-4">
    <p>{`Used by the leading ${ecosystem} maintainers.`}</p>
  </div>
);

const renderSectionHeading = (text: string) => {
  return (
    <h3 className="text-2xl font-semibold mb-4">{text}</h3>
  );
};

export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      {/* Left Column */}
      <div className="fixed top-0 left-0 w-full sm:w-1/2 h-full bg-slate-800 text-slate-50 flex flex-col justify-center p-8 md:p-32" style={{ backgroundImage: "url(/voronoi.png)" }}>
        <div className="overflow-y-auto">
          <div className="p-5">
            <img src="/logo-white.png" width="150px" className="mb-6" />
            <h1 className="text-4xl font-light leading-8 mb-6">The business builder made for<br />open source maintainers.</h1>
            <p className="text-xl font-extralight leading-6 mb-6">Gitwallet is a toolkit to <b>build, sell and manage</b> robust support offerings for your repos and ecosystems.</p>
            <div className="flex inline-flex gap-2 p-1 border-solid border-slate-700 hover:border-slate-200 border-2 rounded-xl">
              <SimpleEmailInputForm placeholder="Enter Your Email" />
              <FormButton label="Get Updates →" size="md" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full sm:w-1/2 ml-auto bg-slate-100 text-slate-800 overflow-y-auto p-16">
        <section className="mb-8">
          {renderSectionHeading("Purpose built for OSS.")}
          <p className="mb-4">Gitwallet is a toolkit for open source maintainers to commercialize their services for their repos and ecosystems. We help leading maintainers create robust support offerings, sell across channels, and grow their business.</p>
        </section>

        <section className="mb-8">
          {renderSectionHeading("How we help maintainers:")}

          <Grid numItems={1} numItemsSm={3} className="text-sm text-slate-50 w-4/5 gap-4">
            <Col>
              <DashboardCard className="h-48 hover:scale-105 hover:z-50 hover:transition-transform duration-100 bg-gradient-to-r bg-gradient-to-t from-emerald-800 to-emerald-700">
                <h2 className="font-bold mb-2">Setup Support Tiers</h2>
                <p className="font-light">We help you quickly build robust support offerings that work for you and the companies that use your OSS.</p>
              </DashboardCard>
            </Col>

            <Col>
              <DashboardCard className="h-48 hover:scale-105 hover:z-50 hover:transition-transform duration-100 bg-rose-600">
                <h2 className="font-bold mb-2">Sell Across Channels</h2>
                <p className="font-light">We provides a hosted site, customizable embeds, and direct sales to market and sell your services.</p>
              </DashboardCard>
            </Col>

            <Col>
              <DashboardCard className="h-48 hover:scale-105 hover:z-50 hover:transition-transform duration-100 bg-gradient-to-t to-sky-700 from-sky-600">
                <h2 className="font-bold mb-2">Manage Your Business</h2>
                <p className="font-light">All your reports, customers, payments and contract information in one place.</p>
              </DashboardCard>
            </Col>

            <Col numColSpanSm={3}>
              <DashboardCard className="bg-slate-200 text-slate-800">
                <h2 className="font-bold mb-2">Help us Shape Gitwallet</h2>
                <p className="font-light">If you would like to shape our product with us, join our design partnership program with leading maintainers across ecosystems.</p>
              </DashboardCard>
            </Col>
          </Grid>
        </section>

        <section className="mb-8">
          {renderSectionHeading("Building with the best.")}
          {/* Iterate over testimonials */}
          <Testimonial ecosystem="Ruby" logoSrc="/logos/ruby.png" />
          <Testimonial ecosystem="Python" logoSrc="/logos/python.png" />
          <Testimonial ecosystem="PHP" logoSrc="/logos/php.png" />
          <Testimonial ecosystem="JavaScript" logoSrc="/logos/javascript.png" />
          {/* Add more testimonials with corresponding logos as needed */}
        </section>



        <section className="mb-8">
          {renderSectionHeading("A Note from the founders")}
          {/* Iterate over testimonials */}
          <p className="mb-4">We're building Gitwallet to help open source maintainers build sustainable businesses. We want to work with you to shape the future of open source.</p>
          <p className="mb-4">- <b>Tarun and the Gitwallet team</b></p>
        </section>

        <section className="mb-8">
          {renderSectionHeading("For Companies That Use Open Source")}
          {/* Iterate over testimonials */}
          <p className="mb-4">If you use open source.</p>
        </section>

        <section className="mb-8">
          {renderSectionHeading("Why We're Building This")}
          {/* Iterate over testimonials */}
          <p className="mb-4">wtf where has this been all my life - Jordan Harband</p>
        </section>


        <section className="mb-8">
          {renderSectionHeading("Frequently Asked Questions")}
          {/* Iterate over testimonials */}
          <AccordionList className="max-w-md mx-auto">
            <Accordion>
              <AccordionHeader>What does this mean for my open source license?</AccordionHeader>
              <AccordionBody>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempor lorem non est
                congue blandit. Praesent non lorem sodales, suscipit est sed, hendrerit dolor.
              </AccordionBody>
            </Accordion>
            <Accordion>
              <AccordionHeader>What about other contributors?</AccordionHeader>
              <AccordionBody>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempor lorem non est
                congue blandit. Praesent non lorem sodales, suscipit est sed, hendrerit dolor.
              </AccordionBody>
            </Accordion>
            <Accordion>
              <AccordionHeader>How do you do payments?</AccordionHeader>
              <AccordionBody>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempor lorem non est
                congue blandit. Praesent non lorem sodales, suscipit est sed, hendrerit dolor.
              </AccordionBody>
            </Accordion>
          </AccordionList>
        </section>
      </div>

    </div>
  );
}
