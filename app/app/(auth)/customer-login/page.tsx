import Image from "next/image";
import GithubLoginButton from "../login/github-login-button";
import LoginButton from "@/components/common/login-button";
import { Suspense } from "react";
import { Divider, Card, TextInput, Button } from "@tremor/react";

export default function LoginPage() {
  const localAuthAvailable = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development';

  return (
    <div className="mx-5 border border-stone-200 py-10 dark:border-stone-700 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md">
      <Image
        alt="Gitwallet"
        width={520}
        height={142}
        className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
        src="/wordmark.png"
      />
      <p className="mt-2 text-center text-md text-stone-600 dark:text-stone-400">
      Manage and secure your open source.<br />
      </p>

      <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
                <label className="block text-sm text-slate-400 text-center mb-4">Enter your email to receive a magic link.</label>
                <div className="flex flex-row gap-4 w-full">
                  <div className="items-center w-full">
                    <TextInput placeholder="Enter your work email" />
                  </div>
                  <div className="items-center">
                    <Button>Get Link</Button>
                  </div>
                </div>
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
