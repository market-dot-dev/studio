"use server";

import {
  checkVendorStripeStatus,
  getVendorStripeConnectURL
} from "@/app/services/stripe/stripe-vendor-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConnectStripeBtn } from "./ConnectStripeBtn";
import { DisconnectStripeBtn } from "./DisconnectStripeBtn";
import { StripeAccountStatus } from "./StripeAccountStatus";

export default async function PaymentSettings() {
  const org = await requireOrganization();

  const { canSell, messageCodes, disabledReasons } = await checkVendorStripeStatus(true);

  // Check if account has been connected at some point but might be disconnected now
  const hasStripeHistory = !!org.stripeAccountId || org.stripeAccountDisabled;
  const oauthUrl = await getVendorStripeConnectURL();

  return (
    <div className="flex max-w-screen-md flex-col space-y-10">
      {hasStripeHistory ? (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex w-full flex-wrap justify-between gap-x-6 gap-y-2">
              <div className="inline-flex w-fit items-center gap-2">
                <h2 className="text-xl font-bold">Stripe Account</h2>
                {org.stripeAccountId && (
                  <Badge
                    variant="secondary"
                    size="sm"
                    tooltip="Your Stripe account ID"
                    className="translate-y-px font-mono"
                  >
                    {org.stripeAccountId}
                  </Badge>
                )}
              </div>

              {org.stripeAccountId && (
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
              isAccountDeauthorized={org.stripeAccountDisabled && !org.stripeAccountId}
              reconnectUrl={org.stripeAccountDisabled ? oauthUrl : undefined}
            />
          </div>

          {org.stripeAccountId && (
            <>
              <Separator className="my-6" />

              <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-4 ">
                <h2 className="text-xl font-bold">Danger Zone</h2>
                <DisconnectStripeBtn stripeAccountId={org.stripeAccountId} />
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
