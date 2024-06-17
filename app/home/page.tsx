"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Accordion, AccordionHeader, AccordionBody, AccordionList } from "@tremor/react";
import { Suspense } from "react";
import PageIllustration from "@/components/common/page-illustration";
import Header from "@/components/common/header";
import CommerceFeatures from "@/components/home/tabs";
import AOS from 'aos'
import 'aos/dist/aos.css'
import HeroHome from "@/components/home/hero-home";
import BuiltFor from "@/components/home/target";
import FeatureMarketplace from "@/components/home/feature-marketplace";
import FeatureInsights from "@/components/home/feature-insights";
import FeatureProducts from "@/components/home/feature-products";
import Logos from "@/components/home/project-logos";
import Footer from "@/components/home/footer";


const surveyLink = "https://form.typeform.com/to/D8fpSsxs";
const maintainerLoginUrl = process.env.NODE_ENV === 'development'
  ? "http://app.gitwallet.local:3000/login"
  : "https://app.gitwallet.co/login";


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

  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 600,
      easing: 'ease-out-sine',
    })
  })

  return (


    <>
      <div className="font-inter antialiased bg-gray-900 text-gray-200 tracking-tight">
        <div className="flex flex-col min-h-screen overflow-hidden">
          <Header/>
          <PageIllustration />
          <HeroHome />
          <Logos />
          <BuiltFor />
          <CommerceFeatures />
          <FeatureProducts />
          <FeatureMarketplace />
          <FeatureInsights />
          <Footer />
        </div>
      </div>
    </>
  );
}


// Sections
// Hero
// Features
// Used by
// Testimonial
// 