import type { ReactElement } from "react";
import React from "react";
import Link from "@/components/design/Link";
import Image from "next/image";
import Hero from "@/components/design/Hero";
import FeatureCard from "@/components/design/FeatureCard";
import Section from "@/components/design/Section";
import AnimatedDashedLine from "@/components/design/AnimatedDashedLine";
import clsx from "clsx";
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
  Shapes,
  UserRound,
  Store,
  Coins,
  ChevronRight
} from "lucide-react";

const colors = {
  default: {
    "100/10": "rgba(140, 140, 136, 0.05)",
    "100": "rgba(140, 140, 136, 1)",
    "10": "rgba(140, 140, 136, 0.05)",
  },
  green: {
    "100/10": "rgba(125, 136, 97, 0.1)",
    "100": "rgba(125, 136, 97)",
    "10": "rgba(239, 240, 237)",
  },
  purple: {
    "100/10": "rgba(106, 107, 148, 0.06)",
    "100": "rgba(106, 107, 148, 1)",
    "10": "rgba(106, 107, 148, 0.06)",
  },
  yellow: {
    "100/10": "rgba(155, 127, 67, 0.05)",
    "100": "rgba(155, 127, 67, 1)",
    "10": "rgba(155, 127, 67, 0.05)",
  },
  yellowish: {
    "100/10": "rgba(149, 149, 125, 0.05)",
    "100": "rgba(149, 149, 125, 1)",
    "10": "rgba(149, 149, 125, 0.05)",
  },
};

interface UserCardProps {
  icon: ReactElement;
  title: string;
  description: string;
  items: {
    icon: ReactElement;
    text: string;
  }[];
}

function UserCard({ icon, title, description, items }: UserCardProps) {
  return (
    <div className="flex w-full h-full flex-col md:rounded-lg bg-white/[88%] p-6 md:p-7 pt-5 md:pt-6 pr-12 md:pr-9 pb-7 md:pb-9 shadow-sm ring-1 ring-black/10">
      {React.cloneElement(icon, { size: 28, color: colors.yellowish["100"], className: 'h-6 lg:h-7 -m-0.5 md:my-0' })}
      <div className="mt-4 mb-5 md:mb-6">
        <h3 className="mb-1 lg:text-[24px] font-bold lg:leading-[28px] tracking-tight">
          {title}
        </h3>
        <p className="text-[15px] leading-5 tracking-[-0.0075em] text-[#8C8C88]">
          {description}
        </p>
      </div>
      <ul className="flex flex-col gap-2 md:gap-3 text-pretty text-[15px] leading-5 tracking-[-0.0075em] text-[#8C8C88] lg:max-w-[40ch] pl-0.5">
        {items.map((item) => (
          <li key={item.text} className="flex gap-4">
            {React.cloneElement(item.icon, {
              size: 20,
              color: colors.yellowish[100],
              className: "shrink-0",
            })}
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 md:gap-12">
          <div className="relative grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <UserCard
              icon={<UserRound />}
              title="Independent Developers"
              description="Jump in with a single service"
              items={[
                {
                  icon: <HandPlatter />,
                  text: "See proven packages other devs use",
                },
                {
                  icon: <ScrollText />,
                  text: "Use templated contracts made for open source agreements",
                },
                {
                  icon: <AppWindow />,
                  text: "Promote yourself with customizable themed landing pages",
                },
              ]}
            />
            <AnimatedDashedLine
              width={2}
              height={36}
              orientation="vertical"
              className="absolute left-[35px] top-1/2 z-[-1] -translate-y-1/2 md:hidden"
            />
            <AnimatedDashedLine
              height={2}
              width={52}
              className="absolute left-1/2 top-1/2 z-[-1] hidden -translate-x-1/2 -translate-y-1/2 md:block"
            />
            <UserCard
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
                  text: "Track sales and see how your services are performing",
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
              className="group -mr-1 flex items-center gap-[3px]"
              style={{ color: colors.default["100"] }}
              aria-label="See how people are using Gitwallet in our Discord"
            >
              See how people are using Gitwallet
              <ChevronRight
                size={20}
                strokeWidth={2.5}
                className="transition group-hover:translate-x-px"
              />
            </Link>
          </div>
        </div>
      </Section>
      <Section
        badge={{
          icon: <Package />,
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
        isFullBleed={true}
      >
        <div className="relative grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          {/* <AnimatedDashedLine
            width={2}
            height={1000}
            orientation="vertical"
            className="absolute left-[35px] top-1/2 z-[-1] -translate-y-1/2 lg:hidden"
          /> */}
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
      <div className="my-9 flex basis-1/2 flex-col gap-4 text-pretty md:my-24 md:max-w-[1000px] md:items-center md:gap-6 md:text-center lg:max-w-none">
        <blockquote
          className={clsx(
            "text-2xl leading-7 tracking-tight text-[#8C8C88] sm:text-[32px] sm:leading-9 lg:text-[40px] lg:leading-[44px]",
          )}
          style={{ hangingPunctuation: "first" }}
        >
          Gitwallet helped our collective of core maintainers{" "}
          <span className="text-[#222214]">
            set up our first commercial se
            <span className="tracking-[-0.005em]">r</span>vices tiers in under a
            week
          </span>
          . Their perspective working in and around engineering and creator
          communities was instrumental in helping us think through the messaging
          that would resonate most.
        </blockquote>
        <div className="flex w-fit items-center gap-3 text-[#8C8C88]">
          <Image
            src="/bc-avatar.jpg"
            width={32}
            height={32}
            className="rounded-full"
            alt="Bethany is a GM at Shipyard"
          />
          Bethany, GM at Shipyard
        </div>
      </div>
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
        description="The source of truth for all your offerings. Start with proven pricing
          structure & contracts to sell nearly whatever you want."
        isFullBleed={true}
      >
        <div className="relative grid w-full grid-cols-1 flex-col gap-6 lg:grid-cols-2">
          
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
        isFullBleed
      >
        <div className="relative grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          {/* <AnimatedDashedLine
            orientation="vertical"
            className="absolute left-[35px] top-0 bottom-0 z-[-1] -translate-y-1/2 lg:hidden"
          /> */}
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
              <>
                <Image
                  src="/logo-icon.svg"
                  alt="echo logo"
                  height={24}
                  width={24}
                  className="h-[22px] w-auto lg:hidden"
                />
                <Image
                  src="/echo-logo.svg"
                  alt="echo logo"
                  height={32}
                  width={164}
                  className="hidden h-[22px] w-auto lg:block"
                />
              </>
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
        color={colors.yellowish["100"]}
        headline="& So Much More"
        description="Full suite of tools to replace the usual suspects and help you build your business."
        isFullBleed
      >
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6 max-w-[950px] mx-auto">
          <FeatureCard
            icon={<UsersRound />}
            title="CRM for OSS"
            description="Fully-featured CRM, re-designed for open source services."
            color={colors.yellowish}
            orientation="vertical"
            imageMaxWidth={null}
            className="ring-0 md:order-1 md:ring-1"
          />
          <FeatureCard
            icon={<ChartLine />}
            title="Sales reports & insights"
            description="Track sales and see how your services are performing."
            color={colors.yellowish}
            orientation="vertical"
            imageMaxWidth={null}
            className="ring-0 md:order-3 md:ring-1"
          />
          <FeatureCard
            icon={<Signature />}
            title="Write & design proposals"
            description="Create, share and sign service agreements in minutes."
            color={colors.yellowish}
            orientation="vertical"
            imageMaxWidth={null}
            isComingSoon
            className="ring-0 md:order-2 md:ring-1"
          />
          <FeatureCard
            icon={<ShoppingCart />}
            title="Custom checkout"
            description="Let people pay in a decicated checkout flow, tailored to you."
            color={colors.yellowish}
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
