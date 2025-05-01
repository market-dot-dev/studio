"use server";

import {
  checkVendorStripeStatus,
  getVendorStripeConnectURL,
  processVendorStripeConnectCallback
} from "@/app/services/stripe-vendor-service";
import UserService from "@/app/services/UserService";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { ConnectStripeBtn } from "./ConnectStripeBtn";
import { DisconnectStripeBtn } from "./DisconnectStripeBtn";
import { StripeAccountStatus } from "./StripeAccountStatus";

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
        await processVendorStripeConnectCallback(code, state);
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

  const { canSell, messageCodes, disabledReasons } = await checkVendorStripeStatus(true);
  const stripeConnected = !!user.stripeAccountId;
  const oauthUrl = !stripeConnected ? await getVendorStripeConnectURL(user.id) : "";

  return (
    <div className="flex max-w-screen-md flex-col space-y-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col items-start gap-4">
          {!stripeConnected && (
            <>
              <h2 className="text-xl font-semibold">Connect Stripe Account</h2>
              <p className="text-sm text-muted-foreground">
                Connect your Stripe account to manage and receive payments. If you have made changes
                recently, try refreshing this page to see the latest status.
              </p>
              <ConnectStripeBtn oauthUrl={oauthUrl} />
            </>
          )}

          {stripeConnected && user.stripeAccountId && (
            <>
              <h2 className="text-xl font-semibold">Stripe Account</h2>
              <StripeAccountStatus
                canSell={canSell}
                messageCodes={messageCodes}
                disabledReasons={disabledReasons}
              />
              <p className="text-sm text-muted-foreground">
                Your Stripe account is connected. Your account ID is:{" "}
                <Badge>{user.stripeAccountId}</Badge>.
              </p>
              <DisconnectStripeBtn userId={user.id} stripeAccountId={user.stripeAccountId} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
