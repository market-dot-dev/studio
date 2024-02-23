"use server";
import { redirect } from "next/navigation";
import { Flex, Text } from "@tremor/react";
import StripeService from "@/app/services/StripeService";
import LinkButton from "@/components/common/link-button";
import DisconnectStripeAccountButton from "../../maintainer/stripe-connect/disconnect-stripe-account-button";
import UserService from "@/app/services/UserService";

const StripeOauthButton = async ({ userId }: { userId: string }) => {
  const oauthUrl = await StripeService.getOAuthLink(userId);

  return <LinkButton href={oauthUrl} label="Connect to Stripe" />;
};

const ActionRequiredBanner: React.FC = () => (
  <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
    <p className="font-semibold">Action Required!</p>
    <p>It looks like there are some issues with your Stripe account settings. Please visit your <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe Dashboard</a> to resolve these issues and ensure your account is fully operational.</p>
  </div>
);

interface AccountCheckProps {
  status: 'pass' | 'fail';
  children: React.ReactNode;
}

const AccountCheck: React.FC<AccountCheckProps> = ({ status, children }) => {
  const color = status === 'pass' ? 'text-green-600' : 'text-red-600';

  return (
    <p className={`text-base font-semibold ${color}`}>{children}</p>
  );
};

export default async function PaymentSettings({
  params,
  searchParams = {},
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const user = await UserService.getCurrentUser();

  if (!user) {
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
    }
  }

  const { canSell, messageCodes, disabledReasons } = await StripeService.performStripeAccountHealthCheck();

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
                {!canSell && (
                  <Flex flexDirection="col" alignItems="start" className="gap-4">
                    <ActionRequiredBanner />
                    { messageCodes.map((message, index) => (
                      <AccountCheck key={index} status='fail'>{StripeService.getErrorMessage(message)}</AccountCheck>
                    ))}
                    { disabledReasons?.map((message, index) => (
                      <AccountCheck key={index} status='fail'>Stripe err code: {message}</AccountCheck>
                    ))}
                  </Flex>
                )}
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
