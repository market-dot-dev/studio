import type { ReactElement } from "react";
import React from "react";
import Link from "@/components/home/new/link";
import Section from "@/components/home/new/section";
import AnimatedDashedLine from "@/components/home/new/animated-dashed-line";
import { discordURL } from "@/lib/home/social-urls";
import {
  UserRound,
  PackageOpen,
  ScrollText,
  AppWindowMac,
  Store,
  UsersRound,
  ChartLine,
  Coins,
  ChevronRight,
} from "lucide-react";

interface CustomerCardProps {
  icon: ReactElement;
  title: string;
  description: string;
  items: {
    icon: ReactElement;
    text: ReactElement | string;
  }[];
}

function CustomerCard({ icon, title, description, items }: CustomerCardProps) {
  return (
    <div className="flex  w-full flex-col bg-white/[88%] p-6 pb-7 pr-12 pt-5 shadow-sm ring-1 ring-black/[9%] rounded-lg lg:p-7 lg:pb-10 lg:pr-9 lg:pt-6">
      {React.cloneElement(icon, {
        size: 28,
        className: "h-6 lg:h-7 -mx-px text-marketing-swamp",
      })}
      <div className="mb-5 mt-3 lg:mt-4 lg:mb-6">
        <h3 className="text-marketing-primary mb-1 lg:text-marketing-md">
          {title}
        </h3>
        <p className="text-marketing-sm leading-5 tracking-[-0.0075em]">
          {description}
        </p>
      </div>
      <ul className="flex flex-col text-pretty pl-0.5 text-marketing-sm leading-5 tracking-[-0.0075em] gap-3 ">
        {items.map((item) => (
          <li key={item.text.toString()} className="flex gap-4">
            {React.cloneElement(item.icon, {
              size: 20,
              className: "shrink-0 text-marketing-swamp",
            })}
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Customers() {
  return (
    <Section
      headline="Tools that Grow with Your Project"
      description="Indie devs, dev shops & established projects use Gitwallet to power their entire open source business."
      isFullBleed
    >
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-5 px-6 sm:gap-8">
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
                  text: "Promote yourself with themed landing pages",
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
            description="Scale up & manage your business"
            items={[
              {
                icon: <UsersRound />,
                text: "Minimal CRM, designed for OSS",
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
        <div className="flex items-center justify-center">
          <Link
            href={discordURL}
            className="text-marketing-sm sm:text-marketing-base group flex items-center gap-[3px] text-pretty text-center"
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
  );
}
