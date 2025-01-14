import Image from "next/image";
import GithubLoginButton from "./github-login-button";
import LoginButton from "@/components/common/login-button";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LOCAL_AUTH_AVAILABLE } from "@/app/config/local-auth";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
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
      <h1 className="mt-8 text-center font-bold tracking-tight dark:text-white text-4xl">
        Login to store.dev
      </h1>
      <p className="mt-3 text-center text-sm text-stone-600 dark:text-stone-400">
        Commerce tools for open source projects
      </p>

      <div className="flex flex-col gap-2 mx-auto mt-8 w-full max-w-sm">
        <Suspense
          fallback={
            <div className="h-12 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <GithubLoginButton />
        </Suspense>
        {LOCAL_AUTH_AVAILABLE && (
          <Suspense>
            <LoginButton href="/login/local-auth" isLoading={false}>
              <p>
                Log in with Local Auth
              </p>
            </LoginButton>
          </Suspense>
        )}
      </div>
    </>
  );
}
