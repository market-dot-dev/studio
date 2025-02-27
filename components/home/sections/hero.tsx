import React from 'react'
import Image from 'next/image'
import Link from '../link';
import Button from '@/components/home/button';
import GradientHeading from '@/components/home/gradient-heading';
import { ChevronRight } from 'lucide-react';
import { loginURL } from '@/lib/home/social-urls';

export default function Hero() {
  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col items-center gap-12 px-6 pt-7 tracking-tight md:gap-y-16 sm:pt-10 lg:max-w-[var(--marketing-max-width)] lg:px-16 lg:pt-14 xl:pt-14">
      <div className="flex h-full w-full flex-col items-center">
        <GradientHeading className="mb-3 whitespace-nowrap text-center text-[clamp(24px,8vw,37px)] font-bold !leading-[0.95] tracking-[-0.045em] text-marketing-primary xs:text-marketing-xl sm:mb-4 lg:mb-5 sm:text-marketing-2xl md:text-marketing-3xl md:tracking-[-0.045em] lg:text-marketing-4xl xl:text-marketing-5xl">
          All-in-One Storefronts, <br /> Built for Developers.
        </GradientHeading>
        <p className="mb-4 max-w-[44ch] text-pretty xs:text-balance text-center text-marketing-sm !leading-[1.25] xs:mb-5 sm:mb-6 sm:text-[clamp(16px,12vw,20px)] lg:text-marketing-md">
          Offer your premium services, sell digital products, and manage your
          entire <br className="xs:hidden" /> business in minutes.
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
        <div className="-mr-60 h-full w-[calc(100vw+192px)] overflow-visible  sm:rounded-md md:-mr-72 md:mt-0 lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[var(--marketing-max-width)] lg:rounded-xl">
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
