import Image from "next/image";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login to Gitwallet",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-9 2xl:grid-cols-12">
      <div className="col-span-4 flex flex-col justify-center bg-stone-100 px-6 pb-[120px] pt-12 lg:p-12 lg:pb-[120px] 2xl:col-span-6">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
      <div className="col-span-5 hidden flex-col justify-center gap-6 text-pretty bg-stone-200 px-6 py-12 text-stone-400 lg:flex lg:p-12 2xl:col-span-6">
        <blockquote className="text-pretty text-marketing-lg font-bold xl:text-marketing-xl 2xl:text-marketing-2xl">
          Gitwallet helped our collective of core maintainers{" "}
          <span className="text-marketing-primary">
            set up our first commercial se
            <span className="tracking-[-0.005em]">r</span>vice tiers in under a
            week
          </span>
          . Their perspective working in and around engineering and creator
          communities was instrumental in helping us think through the messaging
          that would resonate most.
        </blockquote>
        <div className="flex w-fit items-center gap-3">
          <Image
            src="/bc-avatar.jpg"
            width={32}
            height={32}
            className="rounded-full"
            alt="Headshot of Bethany, GM at Shipyard"
          />
          <p className="text-xl font-bold">Bethany, GM at Shipyard</p>
        </div>
      </div>
    </div>
  );
}
