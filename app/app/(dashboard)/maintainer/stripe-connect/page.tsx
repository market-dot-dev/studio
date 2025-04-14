"use server";

import StripeService from "@/app/services/StripeService";
import UserService from "@/app/services/UserService";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import DisconnectStripeAccountButton from "./disconnect-stripe-account-button";

const StripeOauthButton = async ({ userId }: { userId: string }) => {
  const oauthUrl = await StripeService.getOAuthLink(userId);

  return (
    <Link href={oauthUrl} className={buttonVariants({ variant: "outline" })}>
      Connect to Stripe
    </Link>
  );
};

export default async function StripeConnect(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  let user = await UserService.findUser(session.user.id!);

  if (!user) {
    redirect("/login");
  }

  // Handle the case where searchParams might be undefined
  if (props.searchParams) {
    const searchParams = await props.searchParams;
    const code = searchParams["code"] as string;
    const state = searchParams["state"] as string;

    // Check for OAuth callback
    if (code && state) {
      try {
        await StripeService.handleOAuthResponse(code, state);
        user = await UserService.findUser(session.user.id!);
      } catch (error) {
        console.error("Error handling Stripe OAuth callback:", error);
        // Handle error
      }
    }
  }

  if (!user) {
    redirect("/login");
  }

  const stripeConnected = !!user.stripeAccountId;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">Stripe Integration</h1>
        <Card className="p-10">
          <div className="flex flex-col items-start gap-4">
            {stripeConnected ? (
              <>
                <h2 className="text-xl font-bold">Stripe Account</h2>
                <p className="text-sm text-stone-500">Your stripe account is connected.</p>
                <DisconnectStripeAccountButton user={user} />
                <pre>{user.stripeAccountId}</pre>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold">Connect Stripe Account</h2>
                <p className="text-sm text-stone-500">
                  Connect your Stripe account to manage and receive payments.
                </p>
                <StripeOauthButton userId={session.user.id!} />
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
