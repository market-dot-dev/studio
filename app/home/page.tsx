import Image from "next/image";
import Link from "next/link";
import SimpleEmailInputForm from "@/components/common/simple-email-input";
import { Col, Grid } from "@tremor/react";
import DashboardCard from "@/components/common/dashboard-card";
import { Accordion, AccordionHeader, AccordionBody, AccordionList } from "@tremor/react";

// Define a type for the testimonial props, including the logo
type TestimonialProps = {
  ecosystem: string;
  logoSrc: string;
};

const logoPath = "/";
// A simple component to display each testimonial with a logo
const EcosystemLogo: React.FC<TestimonialProps> = ({ ecosystem, logoSrc }) => (
  <div className="flex flex-col items-center gap-4">
    {/* <p className="text-xs">{ecosystem}</p> */}
    <Image alt={ecosystem} src={logoPath + logoSrc} width={80} height={50} />
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
      <div className="sm:fixed top-0 left-0 w-full sm:w-1/2 h-full bg-slate-800 text-slate-50 flex flex-col justify-center p-8 md:p-32" style={{ backgroundImage: "url(/voronoi.png)" }}>
        <div className="overflow-y-auto">
          <div className="p-5">
            <Image alt="Gitwallet" src="/logo-white.png" height={0} width={130} className="mb-6" />
            <h1 className="text-4xl font-light leading-8 mb-6">The business builder made for<br />open source maintainers.</h1>
            <p className="text-xl font-extralight leading-6 mb-6">Gitwallet is a toolkit to <b>build, sell and manage</b> robust support offerings for your repos and ecosystems.</p>
            <div>
              <SimpleEmailInputForm email={{}} placeholder="Enter Your Email"  />
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
          {renderSectionHeading("How We Can Help:")}

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
                <h2 className="font-bold mb-2">Manage Your Open Source Relationships</h2>
                <p className="font-light">If you are a software organization using open source and want to try it for your team, let us know!</p>
              </DashboardCard>
            </Col>
          </Grid>
        </section>

        <section className="mb-8">
          <p className="mb-8">We are working with maintainers across ecosystems to build Gitwallet. If you want to get involved, <Link href="https://form.typeform.com/to/D8fpSsxs" target="_blank" className="underline underline-offset-2">join our design partnership</Link> to get early access and help shape Gitwallet with other maintainers.</p>

          {/* Iterate over testimonials */}
          <div className="flex flex-row gap-4">
            <EcosystemLogo ecosystem="JavaScript" logoSrc="js.png"  />
            <EcosystemLogo ecosystem="Rails" logoSrc="rails.png"  />
            <EcosystemLogo ecosystem="Python" logoSrc="python.png"  />
            <EcosystemLogo ecosystem="PHP" logoSrc="php.png"  />
            <EcosystemLogo ecosystem="GoLang" logoSrc="go.png"  />
          </div>
          {/* Add more testimonials with corresponding logos as needed */}
        </section>

        <section className="w-4/5 mb-8">
          <DashboardCard className="text-sm">
          <h2 className="font-bold mb-2">A Note from the Founders</h2>
          <p className="mb-2">We&apos;ve spent out careers building communities on the Internet. We&apos;ve enabled creators to make millions, and have helped uncover new revenue streams. We were shocked when we discovered that the creator economy forgot about the original creators on the Internet - open source developers. We&apos;re building Gitwallet as a business toolkit for open source maintainers. We&apos;re just getting started.</p>
          <p className="">- <b>Tarun and the Gitwallet team</b></p>
          </DashboardCard>
        </section>


        <section className="mb-8">
          {renderSectionHeading("Frequently Asked Questions")}
          <AccordionList className="max-w">
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
