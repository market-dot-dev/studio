import React from 'react'
import Image from 'next/image'
import Unkern from './Unkern';

export default function Hero() {
  return (
    <div className="flex flex-col items-center gap-y-9 tracking-tight md:gap-12 md:text-[24px] md:leading-8 lg:gap-16">
      <div className="flex h-full w-full max-w-[500px] flex-col items-center md:max-w-none">
        <h1 className="text-marketing-primary mb-4 whitespace-nowrap text-center text-[clamp(32px,12vw,64px)] font-bold leading-[0.9] tracking-[-0.035em] md:mb-6 md:text-[88px] md:tracking-[-0.045em] lg:mb-8 lg:text-[120px] lg:leading-[104px]">
          Business Toolkit
          <br />
          for Open Source
        </h1>
        <p className="mb-6 max-w-[45ch] text-pretty text-center md:mb-8 md:text-[clamp(20px,12vw,24px)] md:leading-[clamp(20px,12vw,28px)]">
          One place to sell se<span className="tracking-normal">r</span>vices,
          find customers & market eve<span className="tracking-normal">r</span>
          ywhere — purpose-built for Open Source.
        </p>
        {/* <p className="mb-6 max-w-[40ch] text-pretty text-center  md:text-[clamp(20px,12vw,24px)] md:leading-[clamp(24px,12vw,32px)] lg:mb-8">
          One place to{" "}
          <span className="text-[#6e7d47]">
            <Package
              size={32}
              className="-mt-1 inline h-5 w-auto self-center md:h-7"
            />{" "}
            Sell services
          </span>
          ,{" "}
          <span className="text-[#9b7f43]">
            <ScanSearch
              size={32}
              className="-mt-1 inline-block h-5 w-auto md:h-7"
            />{" "}
            Find customers
          </span>{" "}
          and{" "}
          <span className="text-[#696b94]">
            <Speech
              size={32}
              className="-mt-1 inline-block h-5 w-auto md:h-7"
            />{" "}
            Market everywhere
          </span>{" "}
          — purpose-built for Open Source.
        </p> */}
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

      <div className="xs:gap-4 flex items-center justify-center gap-3 md:gap-6 lg:gap-x-8">
        <Image
          src="/new-shipyard-logo.svg"
          alt="shipyard logo"
          height={92}
          width={92}
          className="h-[clamp(32px,10vw,48px)] w-full md:h-14 lg:h-16"
        />
        <Image
          src="/new-qs-logo.svg"
          alt="qs logo"
          height={92}
          width={92}
          className="h-[clamp(32px,10vw,48px)] w-full md:h-14 lg:h-16"
        />
        <Image
          src="/new-robyn-logo.svg"
          alt="robyn logo"
          height={92}
          width={92}
          className="h-[clamp(32px,10vw,48px)] w-full md:h-14 lg:h-16"
        />
        <Image
          src="/new-viem-logo.svg"
          alt="viem logo"
          height={92}
          width={126}
          className="h-[clamp(32px,10vw,48px)] w-full md:h-14 lg:h-16"
        />
        <Image
          src="/new-number0-logo.svg"
          alt="number0 logo"
          height={92}
          width={226}
          className="h-[clamp(32px,10vw,48px)] w-full md:h-14 lg:h-16"
        />
      </div>
      <div className="mt-8 md:mt-0 lg:mt-0 -mr-60 md:-mr-72 h-full w-[calc(100vw+192px)] overflow-visible rounded-md ring-1 ring-black/[8%] sm:rounded-lg  lg:mr-0 lg:w-full lg:rounded-xl">
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
