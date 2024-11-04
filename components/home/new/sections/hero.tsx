import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import Button from '@/components/home/new/button';
import GradientHeading from '@/components/home/new/gradient-heading';
import { loginURL } from '@/lib/home/social-urls';

export default function Hero() {
  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col items-center gap-8  px-6 tracking-tight md:text-[24px] lg:max-w-[1300px] lg:px-12">
      <div className="flex h-full w-full max-w-[500px] flex-col items-center md:max-w-none">
        <GradientHeading className="lg:text-marketing-5xl md:text-marketing-4xl mb-5 whitespace-nowrap text-center text-[clamp(30px,12vw,58px)] font-bold leading-[0.9] tracking-[-0.035em] md:mb-6 md:tracking-[-0.045em] lg:mb-8">
          Business Toolkit
          <br />
          for Open Source
        </GradientHeading>
        <p className="mb-6 max-w-[45ch] text-pretty text-center md:mb-8 md:text-[clamp(15px,12vw,24px)] md:leading-[clamp(16px,12vw,28px)]">
          One place to sell se<span className="tracking-normal">r</span>vices,
          find customers & market eve<span className="tracking-normal">r</span>
          ywhere — purpose-built for Open Source.
        </p>
        <Link href={loginURL} className="md:py-3.5 md:mx-6">
          <Button>
            <Image
              src="/github.svg"
              alt="github logo"
              height={24}
              width={24}
              className="h-[22px] w-auto md:h-6"
            />
            Sign up with Github
        </Button>
      </Link>
      </div>
      <div className="xs:-ml-1 xs:gap-4 -ml-2 flex w-fit items-center gap-3 sm:justify-center sm:gap-4 md:gap-6">
        <Image
          src="/new-shipyard-logo.svg"
          alt="shipyard logo"
          height={92}
          width={92}
          className="h-[clamp(16px,9.1vw,48px)] w-auto md:h-12 lg:h-14"
        />
        <Image
          src="/new-qs-logo.svg"
          alt="qs logo"
          height={92}
          width={92}
          className="h-[clamp(16px,9.1vw,48px)] w-auto md:h-12 lg:h-14"
        />
        <Image
          src="/new-arktype-logo.svg"
          alt="arktype logo"
          height={92}
          width={92}
          className="h-[clamp(16px,9.1vw,48px)] w-auto md:h-12 lg:h-14"
        />
        <Image
          src="/new-robyn-logo.svg"
          alt="robyn logo"
          height={92}
          width={92}
          className="h-[clamp(16px,9.1vw,48px)] w-auto md:h-12 lg:h-14"
        />
        <Image
          src="/new-viem-logo.svg"
          alt="viem logo"
          height={92}
          width={126}
          className="h-[clamp(16px,9.1vw,48px)] w-auto md:h-12 lg:h-14"
        />
        <Image
          src="/new-number0-logo.svg"
          alt="number0 logo"
          height={92}
          width={226}
          className="h-[clamp(16px,9.1vw,48px)] w-auto md:h-12 lg:h-14"
        />
      </div>
      <div className="xs:rounded-md -mr-60 h-full w-[calc(100vw+192px)] overflow-visible rounded ring-1 ring-black/[10%] sm:rounded-lg md:-mr-72 md:mt-0 lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[1150px] lg:rounded-xl">
        <Image
          src="/home.png"
          alt="gitwallet logo"
          height={1600}
          width={2400}
          className="drop-shadow-md"
        />
      </div>
    </div>
  );
}
