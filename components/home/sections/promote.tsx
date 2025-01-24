"use client"

import React, { useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import Section from '@/components/home/section';
import FeatureCard from '@/components/home/feature-card';
import { Speech, ShoppingCart, CodeSquare, BookOpenCheck, StoreIcon } from "lucide-react";
import { colors } from '@/lib/home/colors';
import { cn } from '@/lib/utils';

// Define the promotion methods data structure
const promotionMethods = [
  {
    icon: <BookOpenCheck />,
    title: "Get listed on market.dev",
    description: (
      <>
        <Link href={"https://market.dev"}>
          <Image
            alt={"market.dev logo"}
            src="/market-dot-dev-logo.svg"
            height={34}
            width={118}
            aria-labelledby={"market.dev logo"}
            className="mr-[5px] inline h-5 -my-0.5 w-auto shrink-0 -translate-y-px transform"
          />
        </Link>
        is a marketplace for finding services & resources by top open source
        developers in any ecosystem.
      </>
    ),
    image: {
      src: "/market-dot-dev.png",
      alt: "market.dev screenshot",
    },
    link: {
      text: "Explore market.dev",
      href: "https://market.dev",
    },
  },
  {
    icon: <StoreIcon />,
    title: "Custom storefronts",
    description:
      "Sell with your own, standalone site. Start with a beautiful template or pop the hood with a full-screen code editor.",
    image: {
      src: "/landing-page.png",
      alt: "Package cards illustration",
    },
  },
  {
    icon: <ShoppingCart />,
    title: "Checkout links",
    description:
      "Use single-purpose, customizable embeds to promote services on your repo, read.me, or anywhere really.",
    image: {
      src: "/checkout.png",
      alt: "Package cards illustration",
    },
  },
  {
    icon: <CodeSquare />,
    title: "Purpose-built embeds",
    description:
      "Use single-purpose, customizable embeds to promote services on your repo, read.me, or anywhere really.",
    image: {
      src: "/embeds.png",
      alt: "Package cards illustration",
    },
  },
];

export default function Promote() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Section
      id="promote"
      badge={{
        icon: <Speech />,
        title: "Promote",
      }}
      color={colors.purple["100"]}
      headline={
        <>
          Market Eve<span className="tracking-normal">ry</span>where
        </>
      }
      description="It doesn't have to be hard. Promote on your site, in repos & across marketplaces — all from a single source of truth."
      isFullBleed
    >
      {/* Mobile layout */}
      <div className="relative grid w-full grid-cols-1 flex-col gap-6 lg:hidden">
        {promotionMethods.map((method, index) => (
          <FeatureCard
            key={index}
            icon={method.icon}
            title={method.title}
            description={method.description}
            image={method.image}
            color={colors.purple}
            orientation="vertical"
            imageMaxWidth={null}
            link={method.link}
            className={cn(
              "sm:aspect-[4/3]",
              index === 0 && "col-span-full max-h-[500px] lg:aspect-[3/2]",
            )}
          />
        ))}
      </div>

      {/* Desktop tabbed layout */}
      <div className="mx-auto hidden w-full max-w-[1100px] rounded-lg lg:grid lg:grid-cols-[290px_1fr]">
        {/* Tab list */}
        <div className="-mr-4 flex flex-col overflow-hidden rounded-l-lg border border-r-0 border-black/10 bg-black/[2%]">
          {promotionMethods.map((method, index) => (
            <React.Fragment key={method.title}>
              <button
                onClick={() => setActiveTab(index)}
                className={cn(
                  "border-b-none group h-1/4 w-full px-9 py-6 text-left transition-colors hover:bg-[#f8f8f8]",
                  activeTab === index ? "bg-[#f8f8f8]" : "bg-transparent",
                )}
              >
                <div className="flex flex-col justify-center gap-3">
                  <div
                    className={cn(
                      "text-marketing-secondary",
                      "group-hover:text-marketing-purple group-focus:text-marketing-purple",
                      activeTab === index && "text-marketing-purple",
                    )}
                  >
                    {method.icon}
                  </div>
                  <div
                    className={cn(
                      "text-marketing-secondary",
                      "group-hover:text-marketing-purple group-focus:text-marketing-purple",
                      activeTab === index && "text-marketing-purple",
                    )}
                  >
                    {method.title}
                  </div>
                </div>
              </button>
              <hr className="border-t border-black/10 last:hidden" />
            </React.Fragment>
          ))}
        </div>

        {/* Tab content */}
        <div className="h-full min-h-[530px] w-full xl:min-h-[550px]">
          <FeatureCard
            icon={promotionMethods[activeTab].icon}
            title={promotionMethods[activeTab].title}
            description={promotionMethods[activeTab].description}
            image={promotionMethods[activeTab].image}
            color={colors.purple}
            orientation="vertical"
            imageMaxWidth="max-w-[750px]"
            link={promotionMethods[activeTab].link}
            className="h-full ring-0"
          />
        </div>
      </div>
    </Section>
  );
}
