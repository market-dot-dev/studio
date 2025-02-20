import React from 'react'
import Image from 'next/image'
import Link from '../link';
import Button from '@/components/home/button';
import GradientHeading from '@/components/home/gradient-heading';
import { loginURL } from '@/lib/home/social-urls';

export default function Hero() {
  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col items-center gap-12 px-6 pt-6 tracking-tight sm:gap-y-16 sm:pt-10 lg:max-w-[1300px] lg:px-12 lg:pt-12">
      <div className="flex h-full w-full flex-col items-center">
        <Link
          href="https://market.dev"
          target="_blank"
          className="mb-5 xs:mb-6 lg:mb-8 flex h-8 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-black/5 px-3 text-[13px] !text-marketing-primary ring-1 ring-inset ring-black/5 transition hover:bg-black/[7%]  md:h-9 md:px-4 md:text-[15px]"
        >
          <span className="-mt-px">Made by</span>
          <Image
            src="/market-dot-dev-logo.svg"
            alt="market.dev logo"
            height={20}
            width={103}
            className="-mb-px h-[18px] w-auto shrink-0 md:h-5"
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
        <div className="-mr-60 h-full w-[calc(100vw+192px)] overflow-visible  sm:rounded-md md:-mr-72 md:mt-0 lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[1050px] lg:rounded-xl">
          <Image
            src="/home.png"
            alt="market.dev logo"
            height={1600}
            width={2400}
            className="drop-shadow"
          />
        </div>
      </div>
    </div>
  );
}
