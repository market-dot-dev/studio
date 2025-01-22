import React from 'react'
import Image from 'next/image'
import Link from '../link';
import Button from '@/components/home/button';
import GradientHeading from '@/components/home/gradient-heading';
import { loginURL } from '@/lib/home/social-urls';

export default function Hero() {
  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col items-center gap-12 px-6 pt-6 tracking-tight sm:gap-y-[72px] sm:pt-8 lg:max-w-[1300px] lg:gap-y-24 lg:px-12 lg:pt-20">
      <div className="flex h-full w-full flex-col items-center">
        <Link
          href="https://market.dev"
          target="_blank"
          className="whitespace-nowrap text-[15px] flex items-center gap-2 rounded-full ring-1 ring-black/5 ring-inset bg-black/5 px-4 h-10 transition hover:bg-black/10 mb-7 !text-marketing-primary"
        >
          Made by 
          <Image
            src="/market-dot-dev-logo.svg"
            alt="market.dev logo"
            height={20}
            width={103}
            className="h-5 w-auto"
          />
        </Link>
        <GradientHeading className="mb-3 whitespace-nowrap text-center text-[clamp(24px,8vw,37px)] font-bold !leading-[0.95] tracking-[-0.045em] text-marketing-primary xs:mb-4 xs:text-marketing-xl sm:mb-5 sm:text-marketing-2xl md:mb-6 md:text-marketing-3xl md:tracking-[-0.045em] lg:text-marketing-4xl xl:text-marketing-5xl">
          All-in-One Storefronts, <br /> Built for Developers.
        </GradientHeading>
        <p className="mb-4 max-w-[44ch] text-balance text-center text-marketing-sm !leading-[1.25] xs:mb-5 sm:mb-6 sm:text-[clamp(16px,12vw,20px)] lg:text-marketing-md">
          Offer your premium services, sell digital products, and manage your
          entire business in minutes.
        </p>
        <Link href={loginURL} className="lg:mt-1">
          <Button>
            <Image
              src="/github.svg"
              alt="github logo"
              height={24}
              width={24}
              className="pointer-events-none h-[20px] w-auto md:h-6"
            />
            Sign up with Github
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-7 lg:gap-8">
        <div className="-mr-60 h-full w-[calc(100vw+192px)] overflow-visible rounded ring-1 ring-black/[10%] sm:rounded-md md:-mr-72 md:mt-0 lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[1000px] lg:max-w-[1150px] lg:rounded-xl">
          <Image
            src="/home.png"
            alt="store.dev logo"
            height={1600}
            width={2400}
            className="drop-shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
