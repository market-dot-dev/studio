import { Metadata } from "next";
import Image from "next/image";
import LoginButton from "@/components/common/login-button";
import { Suspense } from "react";
import CustomerLogin from "@/components/login/customer-login";
import { LOCAL_AUTH_AVAILABLE } from "@/app/config/local-auth";

export const metadata: Metadata = {
  title: "Customer Login",
};

export default async function LoginPage() {
  return (
    <div className="flex flex-col max-w-xs mx-auto">
      <Image
        alt="market.dev logo"
        width={162}
        height={36}
        className="relative mx-auto h-9 w-auto"
        src="/market-dot-dev-logo.svg"
      />

      <div className="mx-auto mt-4 flex flex-col gap-6 sm:w-full">
        <Suspense
          fallback={
            <div className="my-4 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <CustomerLogin />
        </Suspense>
        {LOCAL_AUTH_AVAILABLE && (
          <Suspense>
            <LoginButton
              href={"/login/local-auth"}
              isLoading={false}
              className="w-full"
            >
              Log in with Local Auth
            </LoginButton>
          </Suspense>
        )}
      </div>
    </div>
  );
}