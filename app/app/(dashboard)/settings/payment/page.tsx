"use server";

import StripeService from "@/app/services/StripeService";
import UserService from "@/app/services/UserService";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import DisconnectStripeAccountButton from "../../maintainer/stripe-connect/disconnect-stripe-account-button";

const StripeOauthButton = async ({ userId }: { userId: string }) => {
  const oauthUrl = await StripeService.getOAuthLink(userId);

  return (
    <Link href={oauthUrl} className={buttonVariants({ variant: "outline" })}>
      Connect to Stripe
    </Link>
  );
};

const ActionRequiredBanner: React.FC = () => (
  <div className="mb-2 flex flex-col">
    <p className="font-semibold">Action Required!</p>
    <p>
      It looks like there are some issues with your Stripe account settings. Please visit your{" "}
      <a
        href="https://dashboard.stripe.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Stripe Dashboard
      </a>{" "}
      to resolve these issues and ensure your account is fully operational. See below for details:
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

export default async function PaymentSettings(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  if (searchParams) {
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
  }

  const user = await UserService.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { canSell, messageCodes, disabledReasons } =
    await StripeService.performStripeAccountHealthCheck();

  const stripeConnected = !!user.stripeAccountId;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col items-start gap-4">
          {!stripeConnected && (
            <>
              <h2 className="text-xl font-semibold">Connect Stripe Account</h2>
              <p className="text-sm text-stone-500">
                Connect your Stripe account to manage and receive payments.If you have made changes
                recently, try refreshing this page to see the latest status.
              </p>
              <StripeOauthButton userId={user.id!} />
            </>
          )}
          {stripeConnected ? (
            <>
              <h2 className="text-xl font-semibold">Stripe Account</h2>
              <p className="text-sm text-stone-500">
                Your Stripe account is connected. Your account ID is: {user.stripeAccountId}
              </p>
              <DisconnectStripeAccountButton user={user} />
              <>
                {canSell && (
                  <Card className="mb-4 flex flex-col border border-green-400 bg-green-100 px-4 py-3 text-green-700">
                    <p className="text-sm font-semibold text-stone-500">
                      Your Stripe account in good standing
                    </p>
                    <p className="mt-2 text-sm text-stone-500">
                      You can sell your services and receive payments.
                    </p>
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
                      <p className="mt-2 text-sm text-stone-500">
                        Stripe Error Codes (These specific codes provide a hint about what may be
                        wrong with the account).
                      </p>
                    )}
                    {disabledReasons?.map((message, index) => (
                      <AccountCheck key={index} status="fail">
                        {message}
                      </AccountCheck>
                    ))}
                    <Link
                      href="https://dashboard.stripe.com"
                      target="_blank"
                      className={cn("w-fit", buttonVariants({ variant: "outline" }))}
                    >
                      Go to Stripe Dashboard
                    </Link>
                  </Card>
                )}
              </>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
