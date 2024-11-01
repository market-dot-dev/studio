import React from 'react'
import Image from "next/image";
import Logo from "@/components/design/Logo";
import NavLinks from './NavLinks';
import clsx from 'clsx';

export default function Aside({ className }: { className?: string }) {
  return (
    <aside className={clsx("left-0 top-0 z-10 flex-col items-start sticky h-screen p-12 pr-0", className)}>
      <Logo className="mb-12 h-8" />
      <h1 className="mb-5 whitespace-nowrap text-[40px] font-bold leading-[1] tracking-[-0.035em] xl:text-[clamp(40px,3.25vw,48px)]">
        Business Toolkit
        <br />
        for Open Source
      </h1>
      <p className="mb-6 max-w-[50ch] text-[#8C8C88]">
        One place to sell services, find customers & market everywhere —
        purpose-built for open source.
      </p>
      <button className="mb-12 flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-[#BBC4A2] px-12 py-3 text-[18px] font-bold">
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
    </aside>
  );
}
