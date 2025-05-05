import { Alert, AlertButton, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const StripeDisabledBanner = () => {
  return (
    <Alert variant="destructive" className="rounded-none border-x-0 border-b border-t-0">
      <AlertTriangle size={18} className="mr-2.5" />
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <AlertTitle>There is an issue with your Stripe Account</AlertTitle>
          <AlertDescription>
            <p>
              Your Stripe account is not connected or has an issue that may prevent sales. Please
              review your settings to resolve this issue.
            </p>
          </AlertDescription>
        </div>
        <AlertButton href="/settings/payment/">Payment Settings</AlertButton>
      </div>
    </Alert>
  );
};
