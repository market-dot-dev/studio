import Image from "next/image";
import Link from "next/link";
import { Col, Grid, Badge } from "@tremor/react";
import DashboardCard from "@/components/common/dashboard-card";

import GithubLoginButton from "@/app/app/(auth)/login/github-login-button";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  AccordionList,
} from "@tremor/react";
import { Suspense } from "react";
import { getRootUrl } from "@/lib/domain";

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
    answer:
      "Nothing changes with your OSS code or license. Gitwallet is a toolkit for any services that you personally provide for companies.",
  },
  {
    question: "Can I use Gitwallet for anything besides support?",
    answer:
      "Soon. Support is where we are starting, but we are working on adding more features to help you build a business around your OSS.",
  },
  {
    question: "Who is building Gitwallet?",
    answer:
      'Gitwallet is being built by Lab0324, a product studio based in Toronto, with developers and designers around the world. We are also working closely with maintainers across ecosystems. If you want to get in touch, feel free to DM <a href="https://www.x.com/tarunsachdeva" target="_blank"><u>the founder</u></a>!',
  },
  {
    question: "How can I learn more and participate?",
    answer:
      'First - thank you for your interest! The best way to participate is join our <a href="' +
      surveyLink +
      '" target="_blank"><u>design partnership</u></a> to get early access and help shape Gitwallet with other maintainers.',
  },
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
  return <h3 className="mb-4 text-2xl font-semibold">{text}</h3>;
};

export default async function HomePage() {
  const loginUrl = getRootUrl("app", "/customer-login");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Column */}
      <div
        className="left-0 top-0 flex h-full w-full flex-col justify-center bg-slate-800 p-8 text-slate-50 md:fixed md:w-1/2 lg:py-32 xl:px-32"
        style={{ backgroundImage: "url(/voronoi.png)" }}
      >
        <div className="overflow-y-auto">
          <div className="w-7/8 lg:w-5/6">
            <Image
              alt="Gitwallet"
              src="/logo-white.png"
              height={0}
              width={130}
              className="mb-6"
            />
            <Badge size="xs" className="mb-4">
              Now Open for Alpha Users
            </Badge>
            <h1 className="mb-6 text-4xl font-light leading-8">
              The business builder made for open source projects.
            </h1>
            <p className="mb-6 text-xl font-extralight leading-6">
              Gitwallet is a toolkit to <b>build, sell and manage</b> robust
              support offerings for your repos and ecosystems.
            </p>
            <div>
              <Suspense>
                <GithubLoginButton />
              </Suspense>
              <p className="font-bold">Customer Login</p>
              <p className="mb-8 font-light">
                Already a customer?{" "}
                <a href={loginUrl} className="underline underline-offset-2">
                  Login here
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="ml-auto w-full overflow-y-auto bg-slate-100 p-8 text-slate-800 md:w-1/2 md:p-16">
        <section className="w-7/8 mb-8 lg:w-5/6">
          {renderSectionHeading("Purpose built for Maintainers")}
          <p className="mb-4">
            Gitwallet is a toolkit for open source maintainers to commercialize
            their services for their repos and ecosystems. We help leading
            maintainers create robust support offerings, sell across channels,
            and grow their business.
          </p>
        </section>

        <section className="mb-8">
          {renderSectionHeading("A Complete Toolkit")}

          <Grid
            numItems={1}
            numItemsLg={3}
            className="w-7/8 gap-4 text-sm text-slate-50 lg:w-5/6"
          >
            <Col>
              <DashboardCard className="bg-emerald-600 duration-100 hover:z-50 hover:scale-105 hover:bg-gradient-to-r hover:bg-gradient-to-t hover:from-emerald-600 hover:to-emerald-800 hover:shadow-lg hover:transition-transform">
                <h2 className="mb-2 font-bold">Setup Support Tiers</h2>
                <p className="mb-8 font-light">
                  Quickly build robust support offerings that work for you and
                  your customers.
                </p>
              </DashboardCard>
            </Col>

            <Col>
              <DashboardCard className="bg-emerald-700 duration-100 hover:z-50 hover:scale-105 hover:bg-gradient-to-b hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:transition-transform">
                <h2 className="mb-2 font-bold">Sell Across Channels</h2>
                <p className="mb-8 font-light">
                  Setup a hosted site, customizable embeds, and direct sales to
                  market and sell your services.
                </p>
              </DashboardCard>
            </Col>

            <Col>
              <DashboardCard className="bg-emerald-800 duration-100 hover:z-50 hover:scale-105 hover:bg-gradient-to-b hover:bg-gradient-to-r hover:from-emerald-700 hover:to-emerald-600 hover:transition-transform">
                <h2 className="mb-2 font-bold">Manage Your Business</h2>
                <p className="mb-8 font-light">
                  All your reports, customers, payments and contract information
                  in one place.
                </p>
              </DashboardCard>
            </Col>

            <Col numColSpan={1} numColSpanLg={3}>
              <DashboardCard>
                <div className="text-slate-800">
                  <Badge size="xs" className="mb-1.5 me-2">
                    For Software Teams
                  </Badge>
                  <p className="text-slate-800">
                    <b>Manage OSS Relationships:</b> We help companies build and
                    scale commercial relationships with the open source
                    ecosystems most important to them.
                  </p>
                </div>
              </DashboardCard>
            </Col>
          </Grid>
        </section>

        <section className="w-7/8 mb-8 lg:w-5/6">
          {renderSectionHeading("Get Involved")}
          <p className="mb-8">
            We are working with maintainers across ecosystems to build
            Gitwallet. If you want to get involved,{" "}
            <Link
              href={surveyLink}
              target="_blank"
              className="underline underline-offset-2"
            >
              join our design partnership
            </Link>{" "}
            to get early access and help shape the early product.
          </p>

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

          <AccordionList className="w-7/8 lg:w-5/6">
            {frequentlyAskedQuestions.map((item, index) => (
              <Accordion key={index}>
                <AccordionHeader className="py-2 text-start">
                  {item.question}
                </AccordionHeader>
                <AccordionBody
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                ></AccordionBody>
              </Accordion>
            ))}
          </AccordionList>
        </section>
      </div>
    </div>
  );
}
