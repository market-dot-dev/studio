import { CheckoutLogin } from "@/components/checkout";
import { getSession } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OTPLoginPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  // Get parameters from query
  const callbackUrl = (searchParams.callbackUrl as string) || "/";

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
        Login to market.dev
      </h1>
      <p className="mt-3 text-center text-sm text-stone-500 dark:text-stone-400">
        All-in-one business tools, built for developers.
      </p>

      <div className="mx-auto mt-6 flex w-full max-w-xs flex-col gap-4">
        <CheckoutLogin redirect={callbackUrl} signup={true} />

        <div className="mt-2 text-center">
          <Link
            href="/login"
            className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
          >
            ← Back to login options
          </Link>
        </div>
      </div>
    </>
  );
}
