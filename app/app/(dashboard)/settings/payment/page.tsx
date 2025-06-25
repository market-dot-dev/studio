"use server";

import {
  checkVendorStripeStatus,
  getVendorStripeConnectURL
} from "@/app/services/stripe/stripe-vendor-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DisconnectStripeBtn } from "./disconnect-stripe-btn";
import { StripeAccountStatus } from "./stripe-account-status";

export default async function PaymentSettings() {
  const org = await requireOrganization();
  const { canSell, messageCodes, disabledReasons } = await checkVendorStripeStatus(true);

  const hasStripeHistory = !!org.stripeAccountId || org.stripeAccountDisabled;
  const oauthUrl = await getVendorStripeConnectURL();

  return (
    <div className="flex max-w-screen-sm flex-col space-y-8">
      {hasStripeHistory && (
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="text-xl font-bold">Stripe Account</h2>
          {org.stripeAccountId && (
            <Badge
              variant="secondary"
              size="sm"
              tooltip="Your Stripe account ID"
              className="translate-y-px font-medium"
            >
              {org.stripeAccountId}
            </Badge>
          )}
        </div>
      )}

      <StripeAccountStatus
        canSell={canSell}
        messageCodes={messageCodes}
        disabledReasons={disabledReasons}
        isAccountDisconnected={org.stripeAccountDisabled && !org.stripeAccountId}
        oauthUrl={oauthUrl}
        hasStripeHistory={hasStripeHistory}
      />

      {hasStripeHistory && org.stripeAccountId && (
        <>
          <Separator className="my-6" />
          <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <h2 className="text-xl font-bold">Danger Zone</h2>
            <DisconnectStripeBtn stripeAccountId={org.stripeAccountId} />
          </div>
        </>
      )}
    </div>
  );
}
