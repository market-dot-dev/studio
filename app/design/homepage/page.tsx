import {
  Package,
  HandPlatter,
  ScrollText,
  FileBox,
  Speech,
  AppWindow,
  CodeSquare,
  ScanSearch,
} from "lucide-react";
import Image from "next/image";
import Hero from "@/components/design/Hero";
import FeatureCard from "@/components/design/FeatureCard";
import Section from "@/components/design/Section";

const colors = {
  green: {
    "100": "rgba(125, 136, 97, 1)",
    "10": "rgba(125, 136, 97, 0.04)",
  },
  purple: {
    "100": "rgba(106, 107, 148, 1)",
    "10": "rgba(106, 107, 148, 0.05)",
  },
  yellow: {
    "100": "rgba(155, 127, 67, 1)",
    "10": "rgba(155, 127, 67, 0.04)",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Section
        icon={<Package />}
        color={colors.green["100"]}
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
            color={colors.green}
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
            color={colors.green}
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
            color={colors.green}
            orientation="vertical"
            isComingSoon
          />
        </div>
      </Section>
      <Section
        icon={<Speech />}
        color={colors.purple["100"]}
        title="Marketing"
        headline="Market Everywhere"
        description="The source of truth for all your offerings. Start with proven pricing
          structure & contracts to sell nearly whatever you want."
      >
        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <FeatureCard
            icon={<AppWindow />}
            title="Fully-customizable landing pages"
            description="Make support, training or consulting packages. Compare your pricing to plans use by real developers."
            image={{
              src: "/landing-page.png",
              alt: "Package cards illustration",
            }}
            color={colors.purple}
            orientation="vertical"
            imageMaxWidth={null}
          />
          <FeatureCard
            icon={<CodeSquare />}
            title="Purpose-built embeds"
            description="Start working with clients faster by accessing our library of ready-made, open source contracts."
            image={{
              src: "/embeds-screenshot.png",
              alt: "Package cards illustration",
            }}
            color={colors.purple}
            orientation="vertical"
            imageMaxWidth={null}
          />
        </div>
      </Section>
      <Section
        icon={<ScanSearch />}
        color={colors.yellow["100"]}
        title="Research"
        headline="Find Projects & Customers"
        description="The source of truth for all your offerings. Start with proven pricing
          structure & contracts to sell nearly whatever you want."
      >
        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <FeatureCard
            icon={<AppWindow />}
            title="Fully-customizable landing pages"
            description="Make support, training or consulting packages. Compare your pricing to plans use by real developers."
            image={{
              src: "/landing-page.png",
              alt: "Package cards illustration",
            }}
            color={colors.yellow}
            orientation="vertical"
            imageMaxWidth={null}
          />
          <FeatureCard
            icon={
              <Image
                src="/echo-logo.svg"
                alt="echo logo"
                height={32}
                width={164}
                className="h-6 w-auto"
              />
            }
            title="Purpose-built embeds"
            description="Start working with clients faster by accessing our library of ready-made, open source contracts."
            image={{
              src: "/embeds-screenshot.png",
              alt: "Package cards illustration",
            }}
            color={colors.yellow}
            orientation="vertical"
            imageMaxWidth={null}
            link={{
              text: "Try it out",
              href: "https://ecosystems.gitwallet.co/",
            }}
          />
        </div>
      </Section>
    </>
  );
}
