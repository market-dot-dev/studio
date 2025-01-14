import React from 'react'
import Image from 'next/image'
import Link from '../link';
import Button from '@/components/home/button';
import GradientHeading from '@/components/home/gradient-heading';
import { loginURL } from '@/lib/home/social-urls';

export default function Hero() {
  return (
    <div className="xs: mx-auto flex w-full max-w-[800px] flex-col items-center gap-12 px-6 pt-10 tracking-tight sm:gap-y-[72px] sm:pt-12 lg:max-w-[1300px] lg:gap-y-24 lg:px-12 lg:pt-24">
      <div className="flex h-full w-full max-w-[500px] flex-col items-center md:max-w-none">
        <GradientHeading className="sm:leading-auto mb-3 whitespace-nowrap text-center text-[clamp(30px,9.5vw,46px)] font-bold leading-[0.9] tracking-[-0.035em] text-marketing-primary xs:mb-4 sm:mb-5 xs:text-marketing-xl sm:text-marketing-2xl md:mb-6 md:text-marketing-3xl md:tracking-[-0.045em] xl:mb-7 xl:text-marketing-5xl">
          Storefronts for Developers.
        </GradientHeading>
        <p className="mb-4 max-w-[63ch] text-pretty text-center text-marketing-sm/5 xs:mb-5 sm:mb-6 sm:text-[clamp(16px,12vw,20px)] sm:leading-[clamp(16px,12vw,28px)] md:max-w-[63ch]">
          Sell premium services, digital products, code repos, and more.  
          Setup in seconds, sell anywhere, and grow your business.
        </p>
        <Link href={loginURL} className="xl:mt-1">
          <Button>
            <Image
              src="/github.svg"
              alt="github logo"
              height={24}
              width={24}
              className="pointer-events-none h-[20px] w-auto sm:h-[22px] md:h-6"
            />
            Sign up with Github
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-7 lg:gap-8">
        <div className="-mr-60 h-full w-[calc(100vw+192px)] overflow-visible rounded ring-1 ring-black/[10%] sm:rounded-md md:-mr-72 md:mt-0 lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[1000px] lg:rounded-xl xl:max-w-[1150px]">
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
