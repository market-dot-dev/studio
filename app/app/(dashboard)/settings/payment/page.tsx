"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, Flex, Text, Button } from "@tremor/react";
import UserService from "@/app/services/UserService";
import StripeService from "@/app/services/StripeService";
import LinkButton from "@/components/common/link-button";
import DisconnectStripeAccountButton from "../../maintainer/stripe-connect/disconnect-stripe-account-button";
const StripeOauthButton = async ({ userId }: { userId: string }) => {
  const oauthUrl = await StripeService.getOAuthLink(userId);

  return <LinkButton href={oauthUrl} label="Connect to Stripe" />;
};

export default async function PaymentSettings({
  params,
  searchParams = {},
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
    return null;
  }

  let user = await UserService.findUser(session.user.id!);

  if (!user) {
    redirect("/login");
    return null;
  }

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
      // Potentially display an error message or redirect to an error page
    }
  }

  if (!user) {
    redirect("/login");
    return null;
  }

  const stripeConnected = !!user.stripeAccountId;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          Stripe Integration
        </h1>
        <Card className="p-10">
          <Flex flexDirection="col" alignItems="start" className="gap-4">
            { !stripeConnected && <>
              <h2 className="font-cal text-xl dark:text-white">Connect Stripe Account</h2>
              <Text>
                Connect your Stripe account to manage and receive payments.
              </Text>
              <StripeOauthButton userId={session.user.id!} />
            </> }
            { stripeConnected && <>
              <h2 className="font-cal text-xl dark:text-white">Stripe Account</h2>
              <Text>
                Your stripe account is connected.
              </Text>
              <DisconnectStripeAccountButton user={user} />
              <pre>
                { user.stripeAccountId }
              </pre>
            </> }
          </Flex>
        </Card>
      </div>
    </div>
  );
}
