import CustomerLogin from "@/components/login/customer-login";
import { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Customer Login"
};

export default async function LoginPage() {
  return (
    <div className="mx-auto flex max-w-xs flex-col gap-6">
      <Image
        alt="market.dev logo"
        width={162}
        height={36}
        className="relative mx-auto h-9 w-auto"
        src="/market-dot-dev-logo.svg"
        priority
      />

      <div className="mx-auto mt-4 flex flex-col gap-6 sm:w-full">
        <Suspense
          fallback={
            <div className="my-4 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <CustomerLogin />
        </Suspense>
      </div>
    </div>
  );
}
