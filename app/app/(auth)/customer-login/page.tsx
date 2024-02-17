import { cookies } from 'next/headers';
import { Metadata } from "next";
import { ReactNode } from "react";
import Image from "next/image";
import LoginButton from "@/components/common/login-button";
import { Suspense } from "react";
import CustomerLogin from "@/components/login/customer-login";

export const metadata: Metadata = {
  title: "Login | Gitwallet",
};

export default async function LoginPage() {
  const localAuthAvailable = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development';
  const csrfToken = cookies().get('next-auth.csrf-token')?.value.split('|')[0];


  return (
    <>
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
          <CustomerLogin csrfToken={csrfToken} />
          </Suspense>
          {localAuthAvailable &&
            <Suspense>
              <LoginButton href={'/login/local-auth'} isLoading={false} >
                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  Log in with Local Auth
                </p>
              </LoginButton>
            </Suspense>}
        </div>
      </>
  );
}
