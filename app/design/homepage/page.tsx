import { Package, HandPlatter, ScrollText, FileBox, Speech, AppWindow, CodeSquare } from "lucide-react";
import Image from "next/image";
import Hero from "@/components/design/Hero";
import FeatureCard from "@/components/design/FeatureCard";
import Section from "@/components/design/Section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Section
        icon={<Package />}
        color="#7d8861"
        title="Offerings"
        headline="Sell Products & Services in Seconds"
        description="The source of truth for all your offerings. Start with proven pricing
          structure & contracts to sell nearly whatever you want."
      >
        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <FeatureCard
            icon={<HandPlatter />}
            title="List services"
            description="Make support, training or consulting packages. Compare your pricing to plans use by real developers."
            image={{
              src: "/package-cards.png",
              alt: "Package cards illustration",
            }}
            color="#7d8861"
            orientation="vertical"
          />
          <FeatureCard
            icon={<ScrollText />}
            title="Use templated contracts"
            description="Start working with clients faster by accessing our library of ready-made, open source contracts."
            image={{
              src: "/contract-template.png",
              alt: "Package cards illustration",
            }}
            color="#7d8861"
            orientation="vertical"
          />
          <FeatureCard
            icon={<FileBox />}
            title="Host digital products"
            description="Upload & host courses, ebooks, or other digital products. We handle the payment processing and delivery."
            image={{
              src: "/course.png",
              alt: "Package cards illustration",
            }}
            color="#7d8861"
            orientation="vertical"
            isComingSoon
          />
        </div>
      </Section>
      <Section
        icon={<Speech />}
        color="#6A6B94"
        title="Marketing"
        headline="Market Everywhere"
        description="The source of truth for all your offerings. Start with proven pricing
          structure & contracts to sell nearly whatever you want."
      >
        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <FeatureCard
            icon={<AppWindow />}
            title="Fully-customizable landing page"
            description="Make support, training or consulting packages. Compare your pricing to plans use by real developers."
            image={{
              src: "/landing-page.png",
              alt: "Package cards illustration",
            }}
            color="#6A6B94"
            orientation="vertical"
            imageMaxWidth={null}
          />
          <FeatureCard
            icon={<CodeSquare />}
            title="Purpose-build embeds"
            description="Start working with clients faster by accessing our library of ready-made, open source contracts."
            image={{
              src: "/embeds-screenshot.png",
              alt: "Package cards illustration",
            }}
            color="#6A6B94"
            orientation="vertical"
            imageMaxWidth={null}
          />
        </div>
      </Section>
    </>
  );
}
