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
        <GradientHeading className="sm:leading-auto mb-3 whitespace-nowrap text-center text-[clamp(30px,9.5vw,46px)] font-bold leading-[0.9] tracking-[-0.035em] text-marketing-primary xs:mb-4 sm:mb-5 sm:text-marketing-3xl md:mb-6 md:text-marketing-4xl md:tracking-[-0.045em] xl:mb-7 xl:text-marketing-5xl">
          The Business Toolkit
          <br />
          for Developers.
        </GradientHeading>
        <p className="mb-4 max-w-[43ch] text-pretty text-center text-marketing-sm/5 xs:mb-5 sm:mb-6 sm:text-[clamp(16px,12vw,20px)] sm:leading-[clamp(16px,12vw,28px)] md:max-w-[48ch]">
          Use store.dev to set up premium se
          <span className="tracking-normal">r</span>vices, find
          <br className="hidden xs:inline md:hidden" /> customers & market eve
          <span className="tracking-normal">r</span>
          ywhere. Built for developers.
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
        <div className="flex w-fit items-center gap-6 px-4 sm:justify-center sm:gap-7 sm:px-0 md:-my-2">
          <Image
            src="/shipyard-logo.svg"
            alt="shipyard logo"
            height={92}
            width={92}
            className="-mx-1.5 h-[clamp(8px,9vw,40px)] w-auto sm:h-[52px] lg:h-[56px] xl:h-[68px]"
            unoptimized
          />
          <Image
            src="/qs-logo.svg"
            alt="qs logo"
            height={92}
            width={92}
            className="-mx-1.5 h-[clamp(8px,9vw,40px)] w-auto sm:h-[52px] lg:h-[56px] xl:h-[68px]"
            unoptimized
          />
          <Image
            src="/arktype-logo.svg"
            alt="arktype logo"
            height={92}
            width={92}
            className="-mx-[5px] h-[clamp(8px,9vw,40px)] w-auto sm:h-[52px] lg:h-[56px] xl:h-[68px]"
            unoptimized
          />
          <Image
            src="/robyn-logo.svg"
            alt="robyn logo"
            height={92}
            width={92}
            className="-mx-[5px] h-[clamp(8px,9vw,40px)] w-auto sm:h-[52px] lg:h-[56px] xl:h-[68px]"
            unoptimized
          />
          <Image
            src="/viem-logo.svg"
            alt="viem logo"
            height={92}
            width={126}
            className="-mx-px h-[clamp(8px,9vw,40px)] w-auto sm:h-[52px] lg:h-[56px] xl:h-[68px]"
            unoptimized
          />
          <Image
            src="/number0-logo.svg"
            alt="number0 logo"
            height={92}
            width={226}
            className="h-[clamp(8px,9vw,40px)] w-auto sm:h-[52px] lg:h-[56px] xl:h-[68px]"
            unoptimized
          />
        </div>
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
