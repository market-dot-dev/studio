import React from 'react'
import Link from '@/components/home/new/link';
import Section from '@/components/home/new/section';
import CustomerCard from '@/components/home/new/customer-card';
import AnimatedDashedLine from '@/components/home/new/animated-dashed-line';
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

export default function WhosItFor() {
  return (
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
  );
}
