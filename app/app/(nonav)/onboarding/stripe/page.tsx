import { StripeAccountStatus } from "@/app/app/(dashboard)/settings/payment/stripe-account-status";
import {
  checkVendorStripeStatus,
  getVendorStripeConnectURL
} from "@/app/services/stripe/stripe-vendor-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { CreditCard, Mail, RefreshCw } from "lucide-react";
import { StripeOnboardingActions } from "./stripe-onboarding-actions";

export default async function StripeOnboardingPage() {
  const organization = await requireOrganization();
  const { canSell, messageCodes, disabledReasons } = await checkVendorStripeStatus(true);
  // TODO: Need to make the custom callback path work
  const oauthUrl = await getVendorStripeConnectURL("/onboarding/stripe/callback");

  const hasStripeHistory = !!organization.stripeAccountId || organization.stripeAccountDisabled;

  return (
    <div className="mx-auto max-w-md">
      <div className="space-y-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Connect Your Stripe Account</h1>
          <p className="text-sm text-muted-foreground">
            Connect Stripe to start accepting payments from your customers
          </p>
        </div>

        <StripeAccountStatus
          canSell={canSell}
          messageCodes={messageCodes}
          disabledReasons={disabledReasons}
          isAccountDisconnected={
            organization.stripeAccountDisabled && !organization.stripeAccountId
          }
          reconnectUrl={organization.stripeAccountDisabled ? oauthUrl : undefined}
          oauthUrl={oauthUrl}
          hasStripeHistory={hasStripeHistory}
        />

        <div className="space-y-8">
          {/* What you need Stripe for */}
          {!canSell && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">You'll need Stripe to:</h3>

              <div className="flex items-start space-x-3">
                <CreditCard className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Accept credit card payments</p>
                  <p className="text-muted-foreground">
                    Let customers pay for your services directly through your store.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RefreshCw className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Offer subscription services</p>
                  <p className="text-muted-foreground">
                    Set up recurring payments for ongoing services.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* What you can do */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              {canSell ? "With Stripe connected, you can:" : "Without Stripe, you can still:"}
            </h3>

            <div className="flex items-start space-x-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">Offer service packages with contact forms</p>
                <p className="text-muted-foreground">
                  Share your services and let prospects contact you directly.
                </p>
              </div>
            </div>

            {canSell && (
              <>
                <div className="flex items-start space-x-3">
                  <CreditCard className="mt-0.5 size-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Accept credit card payments</p>
                    <p className="text-muted-foreground">
                      Let customers pay for your services directly through your store.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <RefreshCw className="mt-0.5 size-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Offer subscription services</p>
                    <p className="text-muted-foreground">
                      Set up recurring payments for ongoing services.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <StripeOnboardingActions isConnected={canSell} />
          <p className="text-center text-xs text-muted-foreground">
            You can always connect Stripe later from your settings page.
          </p>
        </div>
      </div>
    </div>
  );
}
