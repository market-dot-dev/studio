import Image from "next/image";
import Link from "next/link";
import SimpleEmailInputForm from "@/components/common/simple-email-input";
import { Col, Bold, Badge, Button, Text } from "@tremor/react";
import DashboardCard from "@/components/common/dashboard-card";
import { Accordion, AccordionHeader, AccordionBody, AccordionList } from "@tremor/react";
import { Suspense } from "react";
import DomainService from "../services/domain-service";
import GithubLoginButton from "@/app/app/(auth)/login/github-login-button";
import CurvedUnderline from "@/components/common/curved-underline";

const surveyLink = "https://form.typeform.com/to/D8fpSsxs";
const customerLoginUrl = DomainService.getRootUrl('app', '/customer-login');
const maintainerLoginUrl = DomainService.getRootUrl('app', '/login');
const bookDemoUrl = "https://cal.com/tarunsachdeva/gitwallet-demo";
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
    answer: "Gitwallet is being built by Lab0324, a product studio based in Toronto, with developers and designers around the world. We are also working closely with maintainers across ecosystems. If you want to get in touch, feel free to DM <a href=\"https://www.x.com/tarunsachdeva\" target=\"_blank\"><u>the founder</u></a>!"
  },
  {
    question: "How can I learn more and participate?",
    answer: "First - thank you for your interest! The best way to participate is join our <a href=\"" + surveyLink + "\" target=\"_blank\"><u>design partnership</u></a> to get early access and help shape Gitwallet with other maintainers."
  }
];


const logoPath = "/";
// A simple component to display each testimonial with a logo
const EcosystemLogo: React.FC<TestimonialProps> = ({ ecosystem, logoSrc }) => (
  <div className="flex flex-col items-center gap-4">
    <Image alt={ecosystem} src={logoPath + logoSrc} width={80} height={50} />
  </div>
);

const renderSectionHeading = (text: string) => {
  return (
    <h3 className="text-2xl font-bold leading-none tracking-tight mb-2">{text}</h3>
  );
};


export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      {/* Left Column */}
      <div className="md:fixed top-0 left-0 w-full md:w-5/12 h-full bg-slate-800 text-slate-50 flex flex-col justify-center p-8 lg:py-32 xl:px-32" style={{ backgroundImage: "url(/voronoi.png)" }}>
        <div className="">
          <div className="w-7/8">
            <Image alt="Gitwallet" src="/logo-white.png" height={0} width={130} className="mb-6" />
            <h1 className="text-4xl font-bold leading-none tracking-tight mb-6"><CurvedUnderline>Commerce & analytics</CurvedUnderline><br/> made for open source projects.</h1>
            <p className="text-xl font-extralight leading-6 mb-6">Gitwallet is an OS for open source businesses. Get better insight into open source usage, sell products and services across channels, and grow your business. </p>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <Link href={maintainerLoginUrl}><Button color="green" className="w-full">Get Started →</Button></Link>
                <Link href={bookDemoUrl} target="_blank"><Button color="green" className="bg-gray-100 border-gray-100 text-slate-800 hover:bg-gray-300 hover:border-gray-400 items-center w-full">Book a Demo</Button></Link>
              </div>
              <p className="font-light mb-8 text-xs">Existing customer? <a href={customerLoginUrl} className="underline underline-offset-2">Login here</a>.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-7/12 ml-auto bg-slate-100 text-slate-800 overflow-y-auto p-8 md:p-16">
        <section className="mb-2 w-7/8 lg:w-5/6">
          <Badge className="mb-4" size="md"><Bold>Features</Bold></Badge>
        </section>


        <section className="mb-8 w-7/8 lg:w-5/6">
          {renderSectionHeading("Quickly setup commercial services & paid products.")}
          <p className="mb-4">Easily setup robust paid support channels, consulting services, paid downloads and (soon) courses, and dual license distributions for your open source.</p>
          <img src="https://placehold.co/600x400" alt="Placeholder" className="mt-4 w-full rounded-xl" />
        </section>

        <section className="mb-8 w-7/8 lg:w-5/6">
          {renderSectionHeading("Get new insights into your open source usage.")}
          <p className="mb-4">
            Gitwallet provides powerful analytics tools to help you understand how your open source projects are being used. 
          </p>
          <img src="https://placehold.co/600x400" alt="Placeholder" className="mt-4 w-full rounded-xl" />
        </section>

        <section className="mb-8 w-7/8 lg:w-5/6">
          {renderSectionHeading("Find customers & sell across channels.")}
          <p className="mb-4">Gitwallet helps open source projects get better insight into open source usage, setup commercial services & products, and grow their community & business.</p>
          <img src="https://placehold.co/600x400" alt="Placeholder" className="mt-4 w-full rounded-xl" />
        </section>

        <section className="mb-8 w-7/8 lg:w-5/6">
          {renderSectionHeading("Manage an open source business.")}
          <p className="mb-4">Gitwallet helps open source projects get better insight into open source usage, setup commercial services & products, and grow their community & business.</p>
          <img src="https://placehold.co/600x400" alt="Placeholder" className="mt-4 w-full rounded-xl" />
        </section>

        <section className="mb-8  w-7/8 lg:w-5/6">
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

          <AccordionList className="w-7/8 lg:w-5/6">
            {frequentlyAskedQuestions.map((item, index) => (
              <Accordion key={index}>
                <AccordionHeader className="py-2 text-start">{item.question}</AccordionHeader>
                <AccordionBody dangerouslySetInnerHTML={{ __html: item.answer }}></AccordionBody>
              </Accordion>
            ))}
          </AccordionList>

        </section>

      </div>

    </div>
  );
}
