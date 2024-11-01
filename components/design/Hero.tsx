import React from 'react'
import Image from 'next/image'
import Logo from './Logo'
import { ChevronRight } from "lucide-react";
import NavLinks from './NavLinks';

export default function Hero() {
  return (
    <div className="flex flex-col gap-y-12 pt-9 md:pt-12 lg:-mr-12 lg:flex-row">
      <div className="left-0 top-0 z-10 col-span-full flex flex-col items-start px-6 md:px-12 xl:hidden">
        <h1 className="mb-5 whitespace-nowrap text-[clamp(36px,10.5vw,48px)] font-bold leading-[1] tracking-[-0.035em] sm:text-[48px] lg:text-[clamp(40px,4vw,48px)] xl:text-[clamp(40px,3.25vw,48px)]">
          Business Toolkit
          <br />
          for Open Source
        </h1>
        <p className="mb-6 max-w-[50ch] text-[#8C8C88]">
          One place to sell services, find customers & market everywhere —
          purpose-built for open source.
        </p>
        <button className="mb-8 flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-[#BBC4A2] px-12 py-3 text-[18px] font-bold">
          <Image
            src="/github.svg"
            alt="github logo"
            height={24}
            width={24}
            className="h-[22px] w-auto"
          />
          Sign up with Github
        </button>
        <NavLinks />
      </div>
      <div className="pl-6 md:pl-12">
        <Image
          src="/home.png"
          alt="gitwallet logo"
          height={1600}
          width={2400}
          className="lg:max-h-[540px] xl:max-h-none"
        />
      </div>
      {/* <div className="overflow-visible">
        <div className="relative mt-96 aspect-[3/2] w-[calc(100%+8rem)] overflow-visible lg:w-[calc(100%+8rem)] 2xl:w-full">
          <Image
            src="/home.png"
            alt="gitwallet logo"
            fill
            style={{
              objectFit: "contain",
              objectPosition: "left center",
            }}
          />
        </div>
      </div> */}
    </div>
  );
}
