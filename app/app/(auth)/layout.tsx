import Image from "next/image";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login to store.dev",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center bg-stone-100 px-6 py-12 sm:px-12">
      <div className="flex h-full w-full max-w-screen-xl flex-col items-center justify-between gap-x-12 gap-y-24 lg:flex-row lg:justify-center">
        <div className="flex w-full max-w-md flex-col justify-center pb-[72px]">
          <div className="mx-auto w-full max-w-sm">{children}</div>
        </div>
        <div className="hidden w-full flex-col justify-center gap-6 text-pretty pb-12 lg:flex">
          <div className="flex flex-col gap-4 border-black/15 md:gap-6 md:border-l md:pl-9">
            <blockquote className="text-pretty text-2xl font-semibold leading-7 tracking-tightish text-stone-900/50 lg:text-3xl xl:text-4xl">
              store.dev helped our collective of core maintainers{" "}
              <mark className="text-stone-900 bg-transparent">
                set up our first commercial se
                <span className="tracking-[-0.005em]">r</span>vice tiers in
                under a week
              </mark>
              . Their perspective working in and around engineering and creator
              communities was instrumental in helping us think through the
              messaging that would resonate most.
            </blockquote>
            <div className="flex w-fit items-center gap-2 md:gap-3">
              <Image
                src="/bc-avatar.jpg"
                width={32}
                height={32}
                className="h-6 w-6 rounded-full md:h-8 md:w-8"
                alt="Headshot of Bethany, GM at Shipyard"
              />
              <p className="text-base font-semibold text-stone-500 md:text-xl">
                Bethany, GM at Shipyard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
