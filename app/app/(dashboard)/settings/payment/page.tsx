"use server";
import { redirect } from "next/navigation";
import { Flex, Text, Card, Button } from "@tremor/react";
import Link from "next/link";
import StripeService from "@/app/services/StripeService";
import LinkButton from "@/components/common/link-button";
import DisconnectStripeAccountButton from "../../maintainer/stripe-connect/disconnect-stripe-account-button";
import UserService from "@/app/services/UserService";

const StripeOauthButton = async ({ userId }: { userId: string }) => {
  const oauthUrl = await StripeService.getOAuthLink(userId);

  return <LinkButton href={oauthUrl} label="Connect to Stripe" />;
};

const ActionRequiredBanner: React.FC = () => (
  <div className="mb-2 flex flex-col">
    <p className="font-semibold">Action Required!</p>
    <p>
      It looks like there are some issues with your Stripe account settings.
      Please visit your{" "}
      <a
        href="https://dashboard.stripe.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Stripe Dashboard
      </a>{" "}
      to resolve these issues and ensure your account is fully operational. See
      below for details:
    </p>
  </div>
);

interface AccountCheckProps {
  status: "pass" | "fail";
  children: React.ReactNode;
}

const AccountCheck: React.FC<AccountCheckProps> = ({ status, children }) => {
  const color = status === "pass" ? "text-green-600" : "text-red-600";

  return <li className={`${color} font-semibold`}>{children}</li>;
};

export default async function PaymentSettings({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const code = params["code"] as string;
  const state = params["state"] as string;

  // Check for OAuth callback
  if (code && state) {
    try {
      await StripeService.handleOAuthResponse(code, state);
    } catch (error) {
      console.error("Error handling Stripe OAuth callback:", error);
      // Handle error
    }
  }

  const user = await UserService.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { canSell, messageCodes, disabledReasons } =
    await StripeService.performStripeAccountHealthCheck();

  const stripeConnected = !!user.stripeAccountId;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex flex-col space-y-6">
        <Flex flexDirection="col" alignItems="start" className="gap-4">
          {!stripeConnected && (
            <>
              <h2 className="font-cal text-xl dark:text-white">
                Connect Stripe Account
              </h2>
              <Text>
                Connect your Stripe account to manage and receive payments.If
                you have made changes recently, try refreshing this page to see
                the latest status.
              </Text>
              <StripeOauthButton userId={user.id!} />
            </>
          )}
          {stripeConnected && (
            <>
              <h2 className="font-cal text-xl dark:text-white">
                Stripe Account
              </h2>
              <Text>
                Your Stripe account is connected. Your account ID is:{" "}
                {user.stripeAccountId}
              </Text>
              <DisconnectStripeAccountButton user={user} />
              <>
                {canSell && (
                  <Card className="mb-4 flex flex-col border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                    <Text className="font-semibold">
                      Your Stripe account in good standing
                    </Text>
                    <Text className="mt-2">
                      You can sell your services and receive payments.
                    </Text>
                  </Card>
                )}
                {!canSell && (
                  <Card className="mb-4 flex flex-col border border-gray-400 bg-gray-100 px-4 py-3 text-gray-700">
                    <ActionRequiredBanner />
                    {messageCodes.map((message, index) => (
                      <AccountCheck key={index} status="fail">
                        {StripeService.getErrorMessage(message)}
                      </AccountCheck>
                    ))}

                    {disabledReasons && (
                      <Text className="mt-2">
                        Stripe Error Codes (These specific codes provide a hint
                        about what may be wrong with the account).
                      </Text>
                    )}
                    {disabledReasons?.map((message, index) => (
                      <AccountCheck key={index} status="fail">
                        {message}
                      </AccountCheck>
                    ))}

                    <Link
                      href="https://dashboard.stripe.com"
                      target="_blank"
                      className="mt-4"
                    >
                      <Button>Go to Stripe Dashboard</Button>
                    </Link>
                  </Card>
                )}
              </>
            </>
          )}
        </Flex>
      </div>
    </div>
  );
}
