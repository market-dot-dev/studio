"use client";

import { Alert, AlertButton, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";

const SETTINGS_PAYMENT_PATH = "/settings/payment";

export const StripeDisabledBanner = () => {
  const pathname = usePathname();

  if (pathname === SETTINGS_PAYMENT_PATH) {
    return null;
  }

  return (
    <Alert variant="destructive" className="rounded-none">
      <AlertTriangle />
      <div className="flex flex-col justify-between gap-x-6 gap-y-3 lg:flex-row lg:items-center">
        <div>
          <AlertTitle>There's an issue with your Stripe Account</AlertTitle>
          <AlertDescription>
            <p>
              Your Stripe account is not connected or has an issue that may prevent sales. Please
              review your settings to resolve this issue.
            </p>
          </AlertDescription>
        </div>
        <AlertButton href={SETTINGS_PAYMENT_PATH} className="w-full md:w-fit">
          Go to Payment Settings
        </AlertButton>
      </div>
    </Alert>
  );
};
