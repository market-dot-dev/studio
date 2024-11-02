import {
  Package,
  HandPlatter,
  ScrollText,
  FileBox,
  Speech,
  AppWindow,
  CodeSquare,
  ScanSearch,
  Radar,
  UsersRound,
  ChartLine,
  Signature,
  ShoppingCart,
  Shapes
} from "lucide-react";
import Image from "next/image";
import Hero from "@/components/design/Hero";
import FeatureCard from "@/components/design/FeatureCard";
import Section from "@/components/design/Section";

const colors = {
  default: {
    "100": "rgba(149, 149, 125, 1)",
    "10": "rgba(149, 149, 125, 0.04)",
  },
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
        headline="Tools that Grow with Your Project"
        description="Indie devs, dev shops & established projects use Gitwallet to power their entire open source business."
      >
        <div className="flex w-full flex-col gap-6 lg:flex-row"></div>
      </Section>
      <Section
        badge={{
          icon: <Package />,
          title: "Sell",
        }}
        color={colors.green["100"]}
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
            description="Upload & host courses, ebooks and other resources — we handle the payment and delivery."
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
        badge={{
          icon: <Speech />,
          title: "Marketing",
        }}
        color={colors.purple["100"]}
        headline="Market Everywhere"
        description="The source of truth for all your offerings. Start with proven pricing
          structure & contracts to sell nearly whatever you want."
      >
        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <FeatureCard
            icon={<AppWindow />}
            title="Fully-customizable landing pages"
            description="Start with a beautiful template, designed for developers. Not good enough? Pop the hood with a full-screen code editor."
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
            description="Use single-purpose, customizable embeds to promote servies on your repo, read.me or anywhere really."
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
        badge={{
          icon: <ScanSearch />,
          title: "Research",
        }}
        color={colors.yellow["100"]}
        headline="Find Projects & Customers"
        description="The source of truth for all your offerings. Start with proven pricing
          structure & contracts to sell nearly whatever you want."
      >
        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <FeatureCard
            icon={<Radar />}
            title="In-depth repo reports"
            description="Crawl the dependency graph of any repo and find out who's actually using your stuff (or make a logo-soup)."
            image={{
              src: "/radar.png",
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
            title="Explore ecosystems with Echo"
            description="Keep a pulse on open source — find the big players, interesting projects and top talent in any ecosystem."
            image={{
              src: "/echo.png",
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
      <Section
        badge={{
          icon: <Shapes />,
          title: "Everything Else",
        }}
        color={colors.default["100"]}
        headline="And So Much More"
        description="Full suite of tools to replace the usual suspects and help you build your business."
      >
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <FeatureCard
            icon={<UsersRound />}
            title="CRM for OSS"
            description="Fully-featured CRM, re-designed for open source services."
            color={colors.default}
            orientation="vertical"
            imageMaxWidth={null}
          />
          <FeatureCard
            icon={<ChartLine />}
            title="Sales reports & insights"
            description="Track sales and see how your services are performing."
            color={colors.default}
            orientation="vertical"
            imageMaxWidth={null}
          />
          <FeatureCard
            icon={<Signature />}
            title="Write & design proposals"
            description="Create, share and sign service agreements in minutes."
            color={colors.default}
            orientation="vertical"
            imageMaxWidth={null}
            isComingSoon
          />
          <FeatureCard
            icon={<ShoppingCart />}
            title="Custom checkout"
            description="Let people pay in a decicated checkout flow, tailored to you."
            color={colors.default}
            orientation="vertical"
            imageMaxWidth={null}
            isComingSoon
          />
        </div>
      </Section>
    </>
  );
}
