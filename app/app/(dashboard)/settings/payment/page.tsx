"use server";

import {
  checkVendorStripeStatus,
  getVendorStripeConnectURL,
  processVendorStripeConnectCallback
} from "@/app/services/stripe-vendor-service";
import UserService from "@/app/services/UserService";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
      // Clear params
      redirect(`/settings/payment`);
    }
  }

  const user = await UserService.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { canSell, messageCodes, disabledReasons } = await checkVendorStripeStatus(true);

  // Check if account has been connected at some point but might be disconnected now
  const hasStripeHistory = !!user.stripeAccountId || user.stripeAccountDisabled;
  const oauthUrl = await getVendorStripeConnectURL(user.id);

  return (
    <div className="flex max-w-screen-md flex-col space-y-10">
      {hasStripeHistory ? (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex w-full flex-wrap justify-between gap-x-6 gap-y-2">
              <div className="inline-flex w-fit items-center gap-2">
                <h2 className="text-xl font-bold">Stripe Account</h2>
                {user.stripeAccountId && (
                  <Badge
                    variant="secondary"
                    size="sm"
                    tooltip="Your Stripe account ID"
                    className="translate-y-px font-mono"
                  >
                    {user.stripeAccountId}
                  </Badge>
                )}
              </div>

              {user.stripeAccountId && (
                <div className="inline-flex items-center gap-2 text-sm font-medium text-success">
                  <span className="size-1.5 rounded-full bg-success" />
                  Connected
                </div>
              )}
            </div>

            <StripeAccountStatus
              canSell={canSell}
              messageCodes={messageCodes}
              disabledReasons={disabledReasons}
              isAccountDeauthorized={user.stripeAccountDisabled && !user.stripeAccountId}
              reconnectUrl={user.stripeAccountDisabled ? oauthUrl : undefined}
            />
          </div>

          {user.stripeAccountId && (
            <>
              <Separator className="my-6" />

              <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-4 ">
                <h2 className="text-xl font-bold">Danger Zone</h2>
                <DisconnectStripeBtn userId={user.id} stripeAccountId={user.stripeAccountId} />
              </div>
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">Connect Stripe Account</h2>
          <p className="mb-2 text-sm text-muted-foreground">
            Connect your Stripe account to manage and receive payments. If you have made changes
            recently, try refreshing this page to see the latest status.
          </p>
          <ConnectStripeBtn oauthUrl={oauthUrl} className="w-fit" />
        </div>
      )}
    </div>
  );
}
