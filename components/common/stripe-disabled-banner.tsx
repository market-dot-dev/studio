import { Alert, AlertButton, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const StripeDisabledBanner = () => {
  return (
    <Alert variant="warning" className="rounded-none border-x-0 border-b border-t-0">
      <AlertTriangle size={18} className="mr-2.5" />
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <AlertTitle>There is an issue with your Stripe Account</AlertTitle>
          <AlertDescription>
            <p>
              Your Stripe account is not connected or has an issue that may prevent sales. Please
              visit your{" "}
              <a href="/settings/payment" className="underline">
                Payment Settings
              </a>{" "}
              to resolve this issue.
            </p>
          </AlertDescription>
        </div>
        <AlertButton href="/settings/payment">Payment Settings</AlertButton>
      </div>
    </Alert>
    // <Link href="/settings/payment" className={buttonVariants({ variant: "outline" })}>Payment Settings</Link>
  );
};

export default StripeDisabledBanner;
