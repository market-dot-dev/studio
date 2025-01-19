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

  let loginAndOnboardMarketDev = false;

  if (searchParams.source === "market.dev") {
    loginAndOnboardMarketDev = true;
  }

  return (
    <>
      <Image
        alt="store.dev logo"
        width={64}
        height={64}
        className="relative mx-auto h-14 w-14"
        src="/gw-logo-nav.png"
      />
      <h1 className="mt-8 text-center text-4xl font-bold tracking-tight dark:text-white">
        Login to store.dev
      </h1>
      <p className="mt-3 text-center text-sm text-stone-600 dark:text-stone-400">
        Commerce tools for open source projects
      </p>

      <div className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-2">
        <Suspense
          fallback={
            <div className="h-12 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <GithubLoginButton
            callbackUrl={
              loginAndOnboardMarketDev
                ? "/?onboardingType=market.dev"
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
