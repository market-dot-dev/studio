"use client";

import { ConnectStripeBtn } from "@/app/app/(dashboard)/settings/payment/ConnectStripeBtn";
import {
  checkVendorStripeStatus,
  getVendorStripeConnectURL,
  getVendorStripeErrorMessage
} from "@/app/services/stripe/stripe-vendor-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { Button } from "@/components/ui/button";
import { ErrorMessageCode } from "@/types/stripe";
import { CreditCard, Mail, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function StripeOnboardingPage() {
  const [stripeData, setStripeData] = useState<StripeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadStripeData = async () => {
      try {
        // Get the current organization and check Stripe status
        const organization = await requireOrganization();
        const { canSell, messageCodes, disabledReasons } = await checkVendorStripeStatus(true);
        const oauthUrl = await getVendorStripeConnectURL();

        // Resolve error messages for each code
        const errorMessages = await Promise.all(
          messageCodes.map((code) => getVendorStripeErrorMessage(code as ErrorMessageCode))
        );

        // Check if account has been connected at some point but might be disconnected now
        const hasStripeHistory =
          !!organization.stripeAccountId || organization.stripeAccountDisabled;

        setStripeData({
          canSell,
          messageCodes,
          disabledReasons,
          isAccountDeauthorized:
            organization.stripeAccountDisabled && !organization.stripeAccountId,
          reconnectUrl: organization.stripeAccountDisabled ? oauthUrl : undefined,
          oauthUrl,
          errorMessages,
          hasStripeHistory
        });
      } catch (error) {
        console.error("Error loading Stripe data:", error);
        // Fallback data if there's an error
        setStripeData({
          canSell: false,
          messageCodes: [],
          isAccountDeauthorized: false,
          oauthUrl: "#",
          errorMessages: [],
          hasStripeHistory: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStripeData();
  }, []);

  const handleContinue = () => {
    // Store progress in session storage
    sessionStorage.setItem("onboarding-stripe-complete", "true");
    router.push("/onboarding/links");
  };

  const handleSkip = () => {
    sessionStorage.setItem("onboarding-stripe-skipped", "true");
    router.push("/onboarding/links");
  };

  if (isLoading) {
    return <StripeSkeletonLoader />;
  }

  if (!stripeData) {
    return <StripeSkeletonLoader />;
  }

  const isConnected = stripeData.canSell;

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Connect Stripe</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set up payments to accept credit cards for your services through checkout links.
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
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          {isConnected ? (
            <Button onClick={handleContinue} className="w-full">
              Continue
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleSkip} className="w-full">
              Skip for now
            </Button>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            You can always connect Stripe later from your settings page.
          </p>
        </div>
      </div>
    </div>
  );
}

function StripeSkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Connect Stripe</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set up payments to start accepting credit card payments for your services.
        </p>
      </div>

      {/* Stripe Status Skeleton */}
      <div className="animate-pulse rounded-lg border p-4">
        <div className="flex items-center space-x-3">
          <div className="size-5 rounded-full bg-stone-200"></div>
          <div className="flex-1">
            <div className="mb-2 h-5 w-32 rounded bg-stone-200"></div>
            <div className="h-4 w-64 rounded bg-stone-200"></div>
          </div>
        </div>
      </div>

      {/* Connect Button Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 w-full rounded-md bg-stone-200"></div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="animate-pulse space-y-3">
        <div className="h-8 w-full rounded-md bg-stone-200"></div>
      </div>
    </div>
  );
}
