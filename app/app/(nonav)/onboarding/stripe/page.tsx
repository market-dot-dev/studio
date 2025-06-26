import { StripeAccountStatus } from "@/app/app/(dashboard)/settings/payment/stripe-account-status";
import { ONBOARDING_STEPS, getNextStepPath } from "@/app/services/onboarding/onboarding-steps";
import {
  checkVendorStripeStatus,
  getVendorStripeConnectURL
} from "@/app/services/stripe/stripe-vendor-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { CreditCard, Mail, RefreshCw, Settings } from "lucide-react";
import { OnboardingAction } from "../onboarding-action";

export default async function StripeOnboardingPage() {
  const org = await requireOrganization();
  const hasStripeHistory = !!org.stripeAccountId || org.stripeAccountDisabled;
  const oauthUrl = await getVendorStripeConnectURL("/onboarding/stripe/callback");
  const { canSell, messageCodes, disabledReasons } = await checkVendorStripeStatus(true);

  const currentStep = ONBOARDING_STEPS["stripe"];
  const nextPath = getNextStepPath(currentStep.name);

  return (
    <div className="mx-auto max-w-md">
      <div className="space-y-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">{currentStep.title}</h1>
          <p className="text-sm text-muted-foreground">{currentStep.description}</p>
        </div>

        <StripeAccountStatus
          canSell={canSell}
          messageCodes={messageCodes}
          disabledReasons={disabledReasons}
          isAccountDisconnected={org.stripeAccountDisabled && !org.stripeAccountId}
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
              {canSell ? "Stripe is connected and ready!" : "What you can do without Stripe:"}
            </h3>
            <div className="flex items-start space-x-3">
              <CreditCard className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">Create checkout pages</p>
                <p className="text-muted-foreground">
                  You can set up your packages and checkout pages.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">Collect customer details</p>
                <p className="text-muted-foreground">
                  Gather leads and contact information from interested customers.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <OnboardingAction
            currentStep={currentStep.name}
            nextPath={nextPath}
            variant={canSell ? "default" : "secondary"}
            label={canSell ? "Continue" : "Skip for now"}
          />
          <p className="text-center text-xs text-muted-foreground">
            You can always connect Stripe later from your{" "}
            <span className="font-medium text-stone-700">
              <Settings className="ml-px mr-1 inline-block size-3.5 -translate-y-px" />
              Settings
            </span>{" "}
            page.
          </p>
        </div>
      </div>
    </div>
  );
}
