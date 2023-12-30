import Image from "next/image";
import Link from "next/link";
import SimpleEmailInputForm from "@/components/common/simple-email-input";
import { Col, Grid, Badge, Divider } from "@tremor/react";
import DashboardCard from "@/components/common/dashboard-card";
import { Accordion, AccordionHeader, AccordionBody, AccordionList } from "@tremor/react";

const surveyLink = "https://form.typeform.com/to/D8fpSsxs";

// Define a type for the testimonial props, including the logo
type TestimonialProps = {
  ecosystem: string;
  logoSrc: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

const frequentlyAskedQuestions: FAQItem[] = [
  {
    question: "What does this mean for my open source license?",
    answer: "Nothing changes with your OSS code or license. Gitwallet is a toolkit for any services that you personally provide for companies."
  },
  {
    question: "Can I use Gitwallet for anything besides support?",
    answer: "Soon. Support is where we are starting, but we are working on adding more features to help you build a business around your OSS."
  },
  {
    question: "Who is building Gitwallet?",
    answer: "Gitwallet is being built by Lab0324, a product studio based in Toronto, with developers and designers around the world. We are also working closely with maintainers across ecosystems."
  },
  {
    question: "How can I learn more and participate?",
    answer: "Join our <a href=\"" + surveyLink + "\" target=\"_blank\"><u>design partnership</u></a> to get early access and help shape Gitwallet with other maintainers."
  }
];


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
              <SimpleEmailInputForm email={{}} placeholder="Enter Your Email" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full sm:w-1/2 ml-auto bg-slate-100 text-slate-800 overflow-y-auto p-16">
        <section className="mb-8 w-5/6">
          {renderSectionHeading("Purpose built for Maintainers")}
          <p className="mb-4">Gitwallet is a toolkit for open source maintainers to commercialize their services for their repos and ecosystems. We help leading maintainers create robust support offerings, sell across channels, and grow their business.</p>
        </section>

        <section className="mb-8">
          {renderSectionHeading("A Complete Toolkit")}

          <Grid numItems={1} numItemsSm={3} className="text-sm text-slate-50 w-5/6 gap-4">
            <Col>
              <DashboardCard className="h-40 bg-emerald-600 hover:shadow-lg hover:scale-105 hover:z-50 hover:transition-transform duration-100 hover:bg-gradient-to-r hover:bg-gradient-to-t hover:from-emerald-600 hover:to-emerald-800">
                <h2 className="font-bold mb-2">Setup Support Tiers</h2>
                <p className="font-light">Quickly build robust support offerings that work for you and the companies that use your OSS.</p>
              </DashboardCard>
            </Col>

            <Col>
              <DashboardCard className="h-40 bg-emerald-700 hover:shadow-lg hover:scale-105 hover:z-50 hover:transition-transform duration-100 hover:bg-gradient-to-r hover:bg-gradient-to-b hover:from-emerald-600 hover:to-emerald-700">
                <h2 className="font-bold mb-2">Sell Across Channels</h2>
                <p className="font-light">Setup a hosted site, customizable embeds, and direct sales to market and sell your services.</p>
              </DashboardCard>
            </Col>

            <Col>
              <DashboardCard className="h-40 bg-emerald-800 hover:scale-105 hover:z-50 hover:transition-transform duration-100 hover:bg-gradient-to-r hover:bg-gradient-to-b hover:from-emerald-700 hover:to-emerald-600">
                <h2 className="font-bold mb-2">Manage Your Business</h2>
                <p className="font-light">All your reports, customers, payments and contract information in one place.</p>
              </DashboardCard>
            </Col>

            <Col numColSpan={3}>
              <DashboardCard>
                <div className="text-slate-800">
                  <Badge size="xs" className="me-2 mb-1.5">For Software Teams</Badge>
                <p className="text-slate-800"><b>Manage OSS Relationships:</b> We help companies build and scale commercial relationships with the open source ecosystems most important to them.</p>
                  </div>
              </DashboardCard>
            </Col>
          </Grid>
        </section>

        <section className="mb-8 w-5/6">
          {renderSectionHeading("Get Involved")}
          <p className="mb-8">We are working with maintainers across ecosystems to build Gitwallet. If you want to get involved, <Link href={surveyLink} target="_blank" className="underline underline-offset-2">join our design partnership</Link> to get early access and help shape the early product.</p>

          {/* Iterate over testimonials */}
          <div className="flex flex-row gap-4">
            <EcosystemLogo ecosystem="JavaScript" logoSrc="js.png" />
            <EcosystemLogo ecosystem="Rails" logoSrc="rails.png" />
            <EcosystemLogo ecosystem="Python" logoSrc="python.png" />
            <EcosystemLogo ecosystem="PHP" logoSrc="php.png" />
            <EcosystemLogo ecosystem="GoLang" logoSrc="go.png" />
          </div>
          {/* Add more testimonials with corresponding logos as needed */}
        </section>

        <section className="mb-8">
          {renderSectionHeading("Frequently Asked Questions")}

          <AccordionList className="w-5/6">
            {frequentlyAskedQuestions.map((item, index) => (
              <Accordion key={index}>
                <AccordionHeader className="py-2">{item.question}</AccordionHeader>
                <AccordionBody dangerouslySetInnerHTML={{ __html: item.answer }}></AccordionBody>
              </Accordion>
            ))}
          </AccordionList>

        </section>

{/* 
          <section className="w-5/6 mb-8">
            <Divider>Founders Note</Divider>
            <p className="text-center text-sm mb-2">We are building Gitwallet with a simple goal: to make it easier for open source maintainers to build strong businesses on the foundation of their OSS work. We often joke that &quot;the creator economy&quot; forgot about the original online creators - the OSS developers that built the Internet. We want to help fill that gap. We hope Gitwallet becomes a toolkit for developers around the world to turn into entrepreneurs.</p>
            <p className="text-center text-sm">- <b><Link href="https://www.github.com/tarunsachdeva" target="_blank" className="">Tarun</Link> & the Gitwallet team</b></p>
            <Divider />
        </section> */}


      </div>

    </div>
  );
}
