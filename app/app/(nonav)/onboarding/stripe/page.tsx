import { ConnectStripeBtn } from "@/app/app/(dashboard)/settings/payment/ConnectStripeBtn";
import {
  checkVendorStripeStatus,
  getVendorStripeConnectURL,
  getVendorStripeErrorMessage
} from "@/app/services/stripe/stripe-vendor-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { ErrorMessageCode } from "@/types/stripe";
import { CreditCard, Mail, RefreshCw } from "lucide-react";
import { StripeOnboardingActions } from "./stripe-onboarding-actions";
import { StripeStatus } from "./stripe-status";

interface StripeData {
  canSell: boolean;
  messageCodes: string[];
  disabledReasons?: string[];
  isAccountDeauthorized: boolean;
  reconnectUrl?: string;
  oauthUrl: string;
  errorMessages: string[];
  hasStripeHistory: boolean;
}

export default async function StripeOnboardingPage() {
  // Fetch Stripe data on the server
  const organization = await requireOrganization();
  const { canSell, messageCodes, disabledReasons } = await checkVendorStripeStatus(true);
  const oauthUrl = await getVendorStripeConnectURL();

  // Resolve error messages for each code
  const errorMessages = await Promise.all(
    messageCodes.map((code) => getVendorStripeErrorMessage(code as ErrorMessageCode))
  );

  // Check if account has been connected at some point but might be disconnected now
  const hasStripeHistory = !!organization.stripeAccountId || organization.stripeAccountDisabled;

  const stripeData: StripeData = {
    canSell,
    messageCodes,
    disabledReasons,
    isAccountDeauthorized: organization.stripeAccountDisabled && !organization.stripeAccountId,
    reconnectUrl: organization.stripeAccountDisabled ? oauthUrl : undefined,
    oauthUrl,
    errorMessages,
    hasStripeHistory
  };

  const isConnected = stripeData.canSell;

  return (
    <div className="mx-auto max-w-md">
      <div className="space-y-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Connect Your Stripe Account</h1>
          <p className="text-sm text-muted-foreground">
            Connect Stripe to start accepting payments from your customers
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Simple Stripe status without server actions in render */}
          <StripeStatus stripeData={stripeData} />

          {/* If not connected, show the connect button */}
          {!isConnected && (
            <div className="space-y-4">
              <ConnectStripeBtn oauthUrl={stripeData.oauthUrl} className="w-full" />
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* What you need Stripe for */}
          {!isConnected && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">You'll need Stripe to:</h3>

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
            </div>
          )}

          {/* What you can do */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              {isConnected ? "With Stripe connected, you can:" : "Without Stripe, you can still:"}
            </h3>

            <div className="flex items-start space-x-3">
              <Mail className="mt-0.5 size-4 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">Offer service packages with contact forms</p>
                <p className="text-muted-foreground">
                  Share your services and let prospects contact you directly.
                </p>
              </div>
            </div>

            {/* What you can do with Stripe */}
            {isConnected && (
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
          <StripeOnboardingActions isConnected={isConnected} />
          <p className="text-center text-xs text-muted-foreground">
            You can always connect Stripe later from your settings page.
          </p>
        </div>
      </div>
    </div>
  );
}
