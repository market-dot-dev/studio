import { getSession } from "@/lib/auth";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { EmailSignIn } from "./email-signin";
import { GithubSignIn } from "./github-signin";

export default async function LoginPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  // Get parameters from query
  const callbackUrl = (searchParams.callbackUrl as string) || "/";

  // @TODO: This cookie is no longer being set
  // Check for checkout context from cookie (set by API route)
  const signupContext = ((await cookies()) as unknown as UnsafeUnwrappedCookies).get(
    "signup_context"
  );
  const isCheckout = signupContext?.value === "checkout";

  return (
    <>
      <Image
        alt="market.dev logo"
        width={64}
        height={64}
        className="relative mx-auto size-10"
        src="/gw-logo-nav.png"
      />
      <h1 className="mt-4 text-center text-2xl font-bold tracking-tightish dark:text-white">
        {isCheckout ? "Login to complete purchase" : "Login to market.dev"}
      </h1>
      <p className="mt-3 text-center text-sm text-stone-500 dark:text-stone-400">
        {isCheckout
          ? "Please sign in or create an account to continue"
          : "All-in-one business tools, built for developers."}
      </p>

      <div className="mx-auto mt-6 flex w-full max-w-xs flex-col gap-2">
        <Suspense
          fallback={
            <div className="h-12 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <EmailSignIn callbackUrl={callbackUrl} />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-12 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <GithubSignIn callbackUrl={callbackUrl} />
        </Suspense>
      </div>
    </>
  );
}
