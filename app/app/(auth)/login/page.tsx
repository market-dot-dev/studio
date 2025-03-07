import Image from "next/image";
import GithubLoginButton from "./github-login-button";
import LoginButton from "@/components/common/login-button";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LOCAL_AUTH_AVAILABLE } from "@/app/config/local-auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <>
      <Image
        alt="market.dev logo"
        width={64}
        height={64}
        className="relative mx-auto h-10 w-10"
        src="/gw-logo-nav.png"
      />
      <h1 className="mt-4 text-center text-2xl font-bold tracking-tightish dark:text-white">
        Login to market.dev
      </h1>
      <p className="mt-3 text-center text-sm text-stone-500 dark:text-stone-400">
        All-in-one business tools, built for developers.
      </p>

      <div className="mx-auto mt-6 flex w-full max-w-xs flex-col gap-2">
        <Suspense
          fallback={
            <div className="h-12 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <GithubLoginButton
            callbackUrl={
              searchParams.source
                ? `/?source=${searchParams.source}`
                : undefined
            }
          />
        </Suspense>

        {LOCAL_AUTH_AVAILABLE && (
          <Suspense>
            <LoginButton href="/login/local-auth" isLoading={false}>
              <p>Log in with Local Auth</p>
            </LoginButton>
          </Suspense>
        )}
      </div>
    </>
  );
}
