import LocalAuthSection from "@/components/login/local-auth-section";
import { getSession } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import GithubLoginButton from "./github-login-button";

export default async function LoginPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  // Get callbackUrl from query parameters
  const callbackUrl = (searchParams.callbackUrl as string) || undefined;

  return (
    <>
      <Image
        alt="market.dev logo"
        width={64}
        height={64}
        className="relative mx-auto size-10"
        src="/gw-logo-nav.png"
      />
      <h1 className="tracking-tightish mt-4 text-center text-2xl font-bold dark:text-white">
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
              callbackUrl || (searchParams.source ? `/?source=${searchParams.source}` : undefined)
            }
          />
        </Suspense>

        <LocalAuthSection />
      </div>
    </>
  );
}
