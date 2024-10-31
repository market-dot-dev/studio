"use client";
import { useEffect } from "react";
import Image from "next/image";
import PageIllustration from "@/components/common/page-illustration";
import Header from "@/components/common/header";
import ProductFeatures from "@/components/home/tabs";
import AOS from "aos";
import "aos/dist/aos.css";
import HeroHome from "@/components/home/hero-home";
import BuiltFor from "@/components/home/target";
import ProductTour from "@/components/home/product-tour";
import FeatureProducts from "@/components/home/feature-products";
import Logos from "@/components/home/project-logos";
import Footer from "@/components/home/footer";

type TestimonialProps = {
  ecosystem: string;
  logoSrc: string;
};

const logoPath = "/";
// A simple component to display each testimonial with a logo
const EcosystemLogo: React.FC<TestimonialProps> = ({ ecosystem, logoSrc }) => (
  <div className="flex flex-col items-center gap-4">
    <Image alt={ecosystem} src={logoPath + logoSrc} width={80} height={50} />
  </div>
);

export default function HomePage() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });

  return (
    <>
      <div className="overflow-visible">
        <div className="mt-96 w-[calc(100%+8rem)] relative aspect-[3/2] overflow-visible lg:w-[calc(100%+8rem)] 2xl:w-full">
          <Image
            src="/home.png"
            alt="gitwallet logo"
            fill
            style={{
              objectFit: "contain",
              objectPosition: "left center",
            }}
          />
        </div>
      </div>
    </>
  );
}
