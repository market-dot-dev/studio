import type { ReactElement } from "react";
import React from "react";
import Link from "@/components/design/Link";
import Image from "next/image";
import Hero from "@/components/design/Hero";
import CustomerCard from "@/components/design/CustomerCard";
import FeatureCard from "@/components/design/FeatureCard";
import Section from "@/components/design/Section";
import Testimonial from "@/components/design/Testimonial";
import AnimatedDashedLine from "@/components/design/AnimatedDashedLine";
import {
  Package,
  PackageOpen,
  ScrollText,
  FileBox,
  Speech,
  AppWindowMac,
  CodeSquare,
  ScanSearch,
  Target,
  UsersRound,
  ChartLine,
  Signature,
  ShoppingCart,
  Shapes,
  UserRound,
  Store,
  Coins,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

const colors = {
  swamp: {
    "100": "rgba(143, 143, 112, 1)",
    "10%": "rgba(143, 143, 112, 0.06)",
  },
  green: {
    "100": "rgba(125, 136, 97, 1)",
    "10%": "rgba(125, 136, 97, 0.06)",
  },
  purple: {
    "100": "rgba(118, 120, 158, 1)",
    "10%": "rgba(118, 120, 158, 0.06)",
  },
  orange: {
    "100": "rgba(178, 134, 52, 1)",
    "10%": "rgba(178, 134, 52, 0.06)",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Section
        headline="Tools that Grow with Your Project"
        description="Indie devs, dev shops & established projects use Gitwallet to power their entire open source business."
        className="md:mb-[56px]"
        isFullBleed
      >
        <div className="mx-auto flex w-full max-w-[950px] flex-col gap-8 md:gap-12">
          <div className="relative grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div className="relative">
              <CustomerCard
                icon={<UserRound />}
                title="Independent Developers"
                description="Jump in with a single service"
                items={[
                  {
                    icon: <PackageOpen />,
                    text: "See proven packages other devs use",
                  },
                  {
                    icon: <ScrollText />,
                    text: "Use templated contracts made for open source agreements",
                  },
                  {
                    icon: <AppWindowMac />,
                    text: "Promote yourself with customizable themed landing pages",
                  },
                ]}
              />
              <AnimatedDashedLine
                width={2}
                height={36}
                orientation="vertical"
                className="absolute -bottom-[26px] left-[35px] z-[-1] md:hidden"
              />
            </div>
            <AnimatedDashedLine
              height={2}
              width={52}
              className="absolute left-1/2 top-1/2 z-[-1] hidden -translate-x-1/2 -translate-y-1/2 md:block"
            />
            <CustomerCard
              icon={<Store />}
              title="Development Shops"
              description="Scale up & manage your whole business"
              items={[
                {
                  icon: <UsersRound />,
                  text: "CRM designed for OSS",
                },
                {
                  icon: <ChartLine />,
                  text: (
                    <>
                      Track sales and see how your se
                      <span className="tracking-normal">r</span>vices are pe
                      <span className="tracking-normal">r</span>foming
                    </>
                  ),
                },
                {
                  icon: <Coins />,
                  text: "Save time & money by replacing your SaSS-soup",
                },
              ]}
            />
          </div>
          <div className="flex items-center justify-center px-6 md:px-0">
            <Link
              href="#"
              className="group flex items-center gap-[3px] text-pretty text-center"
              aria-label="See how people are using Gitwallet in our Discord"
            >
              See how people are using Gitwallet
              <ChevronRight
                size={20}
                strokeWidth={2.5}
                className="xs:block -mr-1 hidden transition-transform group-hover:translate-x-px"
              />
            </Link>
          </div>
        </div>
      </Section>
      <span id="products" className="hidden"></span>
      <Section
        badge={{
          icon: <ShoppingBag />,
          title: "Sell",
        }}
        color={colors.green["100"]}
        headline={
          <>
            Sell Products
            <br />& Se<span className="tracking-[-0.005em]">r</span>vices
          </>
        }
        description="The source of truth for all your offerings. Start with proven pricing
          structure & contracts to sell nearly whatever you want."
        isFullBleed
      >
        <div className="relative grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          {/* <AnimatedDashedLine
            width={2}
            height={1000}
            orientation="vertical"
            className="absolute left-[35px] top-1/2 z-[-1] -translate-y-1/2 lg:hidden"
          /> */}
          <FeatureCard
            icon={<Package />}
            title="Offer packages"
            description="Make support, training or consulting packages. Compare your pricing to offerings from real developers."
            image={{
              src: "/package-cards.png",
              alt: "Package cards illustration",
            }}
            color={colors.green}
            orientation="vertical"
            className="lg:aspect-[3/4]"
          />
          <FeatureCard
            icon={<ScrollText />}
            title="Use templated contracts"
            description={
              <>
                Sta<span className="tracking-normal">r</span>t working with
                clients faster by accessing our libra
                <span className="tracking-normal">r</span>y of ready-made, open
                source contracts.
              </>
            }
            image={{
              src: "/contract-template.png",
              alt: "Package cards illustration",
            }}
            color={colors.green}
            orientation="vertical"
            className="lg:aspect-[3/4]"
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
            className="lg:aspect-[3/4]"
          />
        </div>
      </Section>
      <Testimonial
        quote={
          <>
            Gitwallet helped our collective of core maintainers{" "}
            <span className="text-marketing-primary">
              set up our first commercial se
              <span className="tracking-[-0.005em]">r</span>vices tiers in under
              a week
            </span>
            . Their perspective working in and around engineering and creator
            communities was instrumental in helping us think through the
            messaging that would resonate most.
          </>
        }
        quotee={{
          name: "Bethany",
          title: "GM",
          image: {
            src: "/bc-avatar.jpg",
          },
          company: {
            name: "Shipyard",
            url: "https://ipshipyard.gitwallet.co/",
          },
        }}
      />
      <Section
        badge={{
          icon: <Speech />,
          title: "Marketing",
        }}
        color={colors.purple["100"]}
        headline={
          <>
            Market Eve<span className="tracking-normal">r</span>ywhere
          </>
        }
        description={
          <>
            The source of truth for all your offerings. Sta
            <span className="tracking-normal">r</span>t with proven pricing
            structure & contracts to sell nearly whatever you want.
          </>
        }
        isFullBleed
      >
        <div className="relative grid w-full grid-cols-1 flex-col gap-6 lg:grid-cols-2">
          <FeatureCard
            icon={<AppWindowMac />}
            title="Fully-customizable landing pages"
            description={
              <>
                Sta<span className="tracking-normal">r</span>t with a beautiful
                template, designed for OS developers. Not good enough? Pop the
                hood with a full-screen code editor.
              </>
            }
            image={{
              src: "/landing-page.png",
              alt: "Package cards illustration",
            }}
            color={colors.purple}
            orientation="vertical"
            imageMaxWidth={null}
            className="sm:aspect-[4/3] lg:aspect-[5/4]"
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
            className="sm:aspect-[4/3] lg:aspect-[5/4]"
          />
        </div>
      </Section>
      <Section
        badge={{
          icon: <ScanSearch />,
          title: "Research",
        }}
        color={colors.orange["100"]}
        headline="Find Projects & Customers"
        description="The source of truth for all your offerings. Start with proven pricing
          structure & contracts to sell nearly whatever you want."
        isFullBleed
      >
        <div className="relative grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          {/* <AnimatedDashedLine
            orientation="vertical"
            className="absolute left-[35px] top-0 bottom-0 z-[-1] -translate-y-1/2 lg:hidden"
          /> */}
          <FeatureCard
            icon={<Target />}
            title="In-depth repo reports"
            description="Crawl the dependency graph of any repo and find out who's actually using your stuff (or make a logo-soup)."
            image={{
              src: "/radar.png",
              alt: "Package cards illustration",
            }}
            color={colors.orange}
            orientation="vertical"
            imageMaxWidth={null}
            className="sm:aspect-[4/3] lg:aspect-[5/4]"
          />
          <FeatureCard
            icon={
              <Image
                src="/echo-logo.svg"
                alt="echo logo"
                height={28}
                width={164}
                className="h-[20px] w-auto"
              />
            }
            title="Explore ecosystems with Echo"
            description="Keep a pulse on open source — find the big players, interesting projects and top talent in any ecosystem."
            image={{
              src: "/echo.png",
              alt: "Package cards illustration",
            }}
            color={colors.orange}
            orientation="vertical"
            imageMaxWidth={null}
            link={{
              text: "Try it out",
              href: "https://ecosystems.gitwallet.co/",
            }}
            className="sm:aspect-[4/3] lg:aspect-[5/4]"
          />
        </div>
      </Section>
      <Section
        badge={{
          icon: <Shapes />,
          title: "Everything Else",
        }}
        color={colors.swamp["100"]}
        headline="& Much Much More"
        description="Full suite of tools to replace the usual suspects and help you build your business."
        isFullBleed
      >
        <div className="mx-auto grid w-full max-w-[1000px] grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          <FeatureCard
            icon={<UsersRound />}
            title="CRM for OSS"
            description="Fully-featured CRM, re-designed for open source services."
            color={colors.swamp}
            orientation="vertical"
            imageMaxWidth={null}
            className="ring-0 md:order-1 md:ring-1"
          />
          <FeatureCard
            icon={<ChartLine />}
            title="Sales reports & insights"
            description="Track sales and see how your services are performing."
            color={colors.swamp}
            orientation="vertical"
            imageMaxWidth={null}
            className="ring-0 md:order-3 md:ring-1"
          />
          <FeatureCard
            icon={<Signature />}
            title="Write & design proposals"
            description="Create, share and sign service agreements in minutes."
            color={colors.swamp}
            orientation="vertical"
            imageMaxWidth={null}
            isComingSoon
            className="ring-0 md:order-2 md:ring-1"
          />
          <FeatureCard
            icon={<ShoppingCart />}
            title="Custom checkout"
            description="Let people pay in a decicated checkout flow, tailored to you."
            color={colors.swamp}
            orientation="vertical"
            imageMaxWidth={null}
            isComingSoon
            className="md:order-4"
          />
        </div>
      </Section>
    </>
  );
}
