import Image from "next/image";
import DevLoginButton from "../local-auth-button";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { LOCAL_AUTH_AVAILABLE } from "@/app/config/local-auth";

export const dynamic = 'force-dynamic';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // This check happens only on the server
  if (!LOCAL_AUTH_AVAILABLE) {
    notFound();
  }

  return (
    <div className="mx-auto sm:w-full sm:max-w-xs">
      <Image
        alt="market.dev logo"
        width={162}
        height={36}
        className="relative mx-auto h-9 w-auto"
        src="/market-dot-dev-logo.svg"
        priority
      />
      <p className="mt-3 text-center text-sm text-stone-500 dark:text-stone-400">
        Log in with local auth credentials
      </p>

      <div className="mx-auto mt-6 w-11/12 max-w-xs sm:w-full">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <DevLoginButton />
        </Suspense>
      </div>
    </div>
  );
}
