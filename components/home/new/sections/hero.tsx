import React from 'react'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className="flex flex-col items-center gap-y-6 tracking-tight md:gap-9 md:text-[24px] md:leading-8">
      <div className="flex h-full w-full max-w-[500px] flex-col items-center md:max-w-none">
        <h1 className="text-marketing-primary lg:text-marketing-5xl mb-5 whitespace-nowrap text-center text-[clamp(30px,12vw,58px)] font-bold leading-[0.9] tracking-[-0.035em] md:mb-6 md:text-marketing-4xl md:tracking-[-0.045em] lg:mb-8">
          Business Toolkit
          <br />
          for Open Source
        </h1>
        <p className="mb-6 max-w-[45ch] text-pretty text-center md:mb-8 md:text-[clamp(19px,12vw,24px)] md:leading-[clamp(20px,12vw,28px)]">
          One place to sell se<span className="tracking-normal">r</span>vices,
          find customers & market eve<span className="tracking-normal">r</span>
          ywhere — purpose-built for Open Source.
        </p>
        <button className="text-marketing-primary flex w-fit items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-[#BBC4A2] px-8 py-3 text-[18px] font-bold transition-all hover:brightness-[103%] active:scale-[99%] active:brightness-[101%] md:py-4 md:text-[20px] md:leading-6 md:tracking-[-0.02em]">
          <Image
            src="/github.svg"
            alt="github logo"
            height={24}
            width={24}
            className="h-[22px] w-auto md:h-6"
          />
          Sign up with Github
        </button>
      </div>
      <div className="-ml-2 xs:-ml-1 flex items-center gap-3 sm:justify-center xs:gap-3.5 sm:gap-4 md:gap-6">
        <Image
          src="/new-shipyard-logo.svg"
          alt="shipyard logo"
          height={92}
          width={92}
          className="h-[clamp(16px,9.1vw,48px)] w-full md:h-12 lg:h-14"
        />
        <Image
          src="/new-qs-logo.svg"
          alt="qs logo"
          height={92}
          width={92}
          className="h-[clamp(16px,9.1vw,48px)] w-full md:h-12 lg:h-14"
        />
        <Image
          src="/new-arktype-logo.svg"
          alt="arktype logo"
          height={92}
          width={92}
          className="h-[clamp(16px,9.1vw,48px)] w-full md:h-12 lg:h-14"
        />
        <Image
          src="/new-robyn-logo.svg"
          alt="robyn logo"
          height={92}
          width={92}
          className="h-[clamp(16px,9.1vw,48px)] w-full md:h-12 lg:h-14"
        />
        <Image
          src="/new-viem-logo.svg"
          alt="viem logo"
          height={92}
          width={126}
          className="h-[clamp(16px,9.1vw,48px)] w-full md:h-12 lg:h-14"
        />
        <Image
          src="/new-number0-logo.svg"
          alt="number0 logo"
          height={92}
          width={226}
          className="h-[clamp(16px,9.1vw,48px)] w-full md:h-12 lg:h-14"
        />
      </div>
      <div className="-mr-60 mt-6 h-full w-[calc(100vw+192px)] overflow-visible rounded-md ring-1 ring-black/[8%] sm:rounded-lg md:-mr-72 md:mt-0 lg:mx-auto lg:mr-0 lg:mt-0 lg:w-full lg:max-w-[1150px] lg:rounded-xl">
        <Image
          src="/home.png"
          alt="gitwallet logo"
          height={1600}
          width={2400}
          className="drop-shadow"
        />
      </div>
    </div>
  );
}
