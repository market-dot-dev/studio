"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, Flex, Text, Button } from "@tremor/react";
import UserService from "@/app/services/UserService";
import StripeService from "@/app/services/StripeService";
import LinkButton from "@/components/common/link-button";
import DisconnectStripeAccountButton from "../../maintainer/stripe-connect/disconnect-stripe-account-button";
import { User } from "@prisma/client";

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
  }

  const code = searchParams["code"] as string;
  const state = searchParams["state"] as string;

  // Check for OAuth callback
  if (code && state) {
    try {
      await StripeService.handleOAuthResponse(code, state);
    } catch (error) {
      console.error("Error handling Stripe OAuth callback:", error);
      // Handle error
      // Potentially display an error message or redirect to an error page
    }
  }

  const { user, accountInfo } = await StripeService.getAccountInfo() as { user: User, accountInfo: any };

  if (!user) {
    redirect("/login");
    return null;
  }

  const stripeConnected = !!user.stripeAccountId;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex flex-col space-y-6">
          <Flex flexDirection="col" alignItems="start" className="gap-4">
            { !stripeConnected && <>
              <h2 className="font-cal text-xl dark:text-white">Connect Stripe Account</h2>
              <Text>
                Connect your Stripe account to manage and receive payments.
              </Text>
              <StripeOauthButton userId={user.id!} />
            </> }
            { stripeConnected ? 
            <>
              <h2 className="font-cal text-xl dark:text-white">Stripe Account</h2>
              <Text>
                Your stripe account is connected. Your account ID is:
              </Text>
              <pre>
                { user.stripeAccountId }
              </pre>
              
              <>
                {accountInfo ? (
                    <Flex flexDirection="col" alignItems="start" className="gap-4">
                        {(accountInfo.chargesEnabled === false || accountInfo.payoutsEnabled === false || accountInfo.disabledReason) && (
                            <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                                <p className="font-semibold">Action Required!</p>
                                <p>It looks like there are some issues with your Stripe account settings. Please visit your <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe Dashboard</a> to resolve these issues and ensure your account is fully operational.</p>
                            </div>
                        )}
                        <p className="text-base"><span className="font-semibold">Country:</span> {accountInfo.country}</p>
                        <p className="text-base"><span className="font-semibold">Default Currency:</span> {accountInfo.defaultCurrency}</p>
                        <p className={`text-base ${accountInfo.chargesEnabled ? 'text-green-600' : 'text-red-600'}`}><span className="font-semibold">Charges Enabled:</span> {accountInfo.chargesEnabled ? 'Yes' : 'No'}</p>
                        <p className={`text-base ${accountInfo.payoutsEnabled ? 'text-green-600' : 'text-red-600'}`}><span className="font-semibold">Payouts Enabled:</span> {accountInfo.payoutsEnabled ? 'Yes' : 'No'}</p>
                        {/* <p className={`text-base ${accountInfo.capabilities.cardPayments === 'active' ? 'text-green-600' : 'text-red-600'}`}><span className="font-semibold">Card Payments Status:</span> {accountInfo.capabilities.cardPayments}</p>
                        <p className={`text-base ${accountInfo.capabilities.transfers === 'active' ? 'text-green-600' : 'text-red-600'}`}><span className="font-semibold">Transfers Status:</span> {accountInfo.capabilities.transfers}</p> */}
                        {accountInfo.disabledReason && <p className="text-base text-red-600"><span className="font-semibold">Disabled Reason:</span> {accountInfo.disabledReason}</p>}
                        <p className="text-base"><span className="font-semibold">Requirements Currently Due:</span> {accountInfo.requirements.currentlyDue.join(', ') || 'None'}</p>
                        {/* <p className="text-base"><span className="font-semibold">Past Due Requirements:</span> {accountInfo.requirements.pastDue.join(', ') || 'None'}</p> */}
                        
                    </Flex>
                ) : null}
              </>
              <DisconnectStripeAccountButton user={user} />
            </> :
            null
            }
          </Flex>
      </div>
    </div>
  );
}
