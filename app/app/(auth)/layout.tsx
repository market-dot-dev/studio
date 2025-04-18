import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login to market.dev"
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-full min-h-screen flex-col items-center justify-center bg-stone-100 px-6 py-12 sm:px-12">
      <div className="flex size-full max-w-screen-xl flex-col items-center justify-between gap-x-12 gap-y-24 lg:flex-row lg:justify-center">
        <div className="flex w-full max-w-md flex-col justify-center pb-[72px]">
          <div className="mx-auto w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
