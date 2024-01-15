import Image from "next/image";
import GithubLoginButton from "./github-login-button";
import LoginButton from "@/components/common/login-button";
import { Suspense } from "react";

export default function LoginPage() {
  const localAuthAvailable = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development';

  return (
    <div className="mx-5 border border-stone-200 py-10 dark:border-stone-700 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md">
      <Image
        alt="Gitwallet"
        width={100}
        height={100}
        className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
        src="/logo.png"
      />
      <h1 className="mt-6 text-center font-cal text-3xl dark:text-white">
        Gitwallet
      </h1>
      <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
      Create & manage robust support tiers for your repos and ecosystems.<br />
      </p>

      <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <GithubLoginButton />
        </Suspense>
        { localAuthAvailable &&
          <Suspense>
            <LoginButton href={'/login/local-auth'} isLoading={false} >
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                Log in with Local Auth
              </p>
            </LoginButton>
          </Suspense> }
      </div>
    </div>
  );
}
