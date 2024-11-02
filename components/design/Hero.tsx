import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Package, ScanSearch, Speech } from "lucide-react";

export default function Hero() {
  return (
    <div className="flex flex-col items-center gap-12 tracking-tight md:gap-12 md:text-[24px] md:leading-8">
      <div className="flex h-full w-full max-w-[500px] flex-col items-center md:max-w-none">
        <h1 className="mb-6 whitespace-nowrap text-center text-[clamp(32px,12vw,64px)] font-bold leading-[0.9] tracking-[-0.035em] md:text-[88px] md:tracking-[-0.045em] xl:mb-10 xl:text-[120px] xl:leading-[104px]">
          Business Toolkit
          <br />
          for Open Source
        </h1>
        <p className="mb-6 text-pretty text-center text-[clamp(20px,12vw,24px)] leading-[clamp(24px,12vw,32px)] text-[#8C8C88] md:max-w-[45ch]  xl:mb-8">
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
        </p>
        <button className="flex w-fit items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-[#BBC4A2] px-8 py-3 text-[18px] font-bold md:text-[20px] md:leading-6 md:tracking-[-0.02em]">
          <Image
            src="/github.svg"
            alt="github logo"
            height={24}
            width={24}
            className="h-[22px] w-auto md:h-6"
          />
          Sign up with Github
        </button>
        {/* <NavLinks /> */}
        {/* <div className="flex gap-4">
          <p className="text-[#8C8C88]">Why we exist</p>
          <p className="text-[#8C8C88]">Changelog</p>
        </div> */}
      </div>
      {/* <div className="drop-shadow-sm md:-mr-[100vw] xl:-mr-64"> */}
      <div className="-mr-32 drop-shadow-sm md:-mx-9 xl:m-0">
        <Image
          src="/home.png"
          alt="gitwallet logo"
          height={1600}
          width={2400}
          className="h-full w-full lg:max-w-[1100px]"
        />
      </div>
      {/* <div className="overflow-visible">
        <div className="relative mt-96 aspect-[3/2] w-[calc(100%+8rem)] overflow-visible md:w-[calc(100%+8rem)] 2xl:w-full">
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
