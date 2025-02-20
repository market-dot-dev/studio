import Image from "next/image";
import DevLoginButton from "../local-auth-button";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { LOCAL_AUTH_AVAILABLE } from "@/app/config/local-auth";

export default function LoginPage() {
  if(!LOCAL_AUTH_AVAILABLE) {
    notFound();
  }

  return (
    <div className="mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md">
      <Image
        alt="market.dev"
        width={100}
        height={100}
        className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
        src="/gw-logo.png"
      />
      <h1 className="mt-6 text-center font-cal text-3xl dark:text-white">
        market.dev
      </h1>
      <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
        Log in with local auth credentials<br />
      </p>

      <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
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
