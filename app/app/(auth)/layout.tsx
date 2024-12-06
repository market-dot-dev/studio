import Image from "next/image";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login to Gitwallet",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-stone-100 px-6 py-12 sm:px-12 items-center h-full">
      <div className="h-full justify-between items-center lg:justify-center flex w-full max-w-screen-2xl grid-cols-9 flex-col gap-x-12 gap-y-24 lg:grid  2xl:grid-cols-12">
        <div className="col-span-4 flex flex-col justify-center pb-[72px] 2xl:col-span-6 w-full">
          <div className="mx-auto w-full max-w-md">{children}</div>
        </div>
        <div className="col-span-5 hidden lg:flex flex-col justify-center gap-6 text-pretty 2xl:col-span-6 pb-12">
          <div className="flex flex-col gap-4 md:gap-6 border-black/15 md:border-l md:pl-9">
            <blockquote className="tracking-tightish text-pretty text-2xl leading-7 lg:text-3xl font-medium text-stone-900 xl:text-4xl">
              Gitwallet helped our collective of core maintainers{" "}
              <mark className="rounded bg-marketing-swamp/25 px-2">
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
                className="rounded-full h-6 w-6 md:h-8 md:w-8"
                alt="Headshot of Bethany, GM at Shipyard"
              />
              <p className="tracking-tightish text-base md:text-xl font-medium text-stone-500">
                Bethany, GM at Shipyard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
