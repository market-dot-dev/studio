import { getVendorStripeErrorMessage } from "@/app/services/stripe/stripe-vendor-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ErrorMessageCode } from "@/types/stripe";
import { AlertTriangle, CircleCheck, CreditCard, ExternalLink } from "lucide-react";
import { ConnectStripeBtn } from "./connect-stripe-btn";
import { StripeDashboardButton } from "./stripe-dashboard-button";

interface StripeAccountStatusProps {
  canSell: boolean;
  oauthUrl: string;
  messageCodes: string[];
  hasStripeHistory: boolean;
  disabledReasons?: string[];
  isAccountDisconnected?: boolean;
}

export function StripeAccountStatus({
  canSell,
  oauthUrl,
  messageCodes,
  hasStripeHistory,
  disabledReasons,
  isAccountDisconnected = false
}: StripeAccountStatusProps) {
  // If no Stripe history (never connected), show connect button
  if (!hasStripeHistory) {
    return (
      <Alert variant="default" className="p-0">
        <AlertTitle className="inline-flex gap-2 px-4 pt-4">
          <CreditCard size={16} className="-translate-y-px text-muted-foreground" />
          No payment method connected
        </AlertTitle>
        <AlertDescription className="px-4 pb-4">
          Connect Stripe to accept credit card payments for your services.
        </AlertDescription>
        <Separator />
        <ConnectStripeBtn oauthUrl={oauthUrl} className="w-full rounded-t-none shadow-none" />
      </Alert>
    );
  }

  // Successful state
  if (canSell) {
    return (
      <Alert variant="success" className="p-0">
        <AlertTitle className="inline-flex gap-2 px-4 pt-4">
          <CircleCheck
            size={18}
            className="-m-px -translate-y-px fill-success stroke-white text-success"
          />
          Your Stripe account is connected and in good standing
        </AlertTitle>
        <AlertDescription className="px-4 pb-4">
          You can sell your services and receive payments.
        </AlertDescription>
        <Separator />
        <StripeDashboardButton>
          Go to Stripe Dashboard
          <ExternalLink />
        </StripeDashboardButton>
      </Alert>
    );
  }

  // Check if account has been disconnected from Stripe's side
  const hasDisconnectError = messageCodes.includes(ErrorMessageCode.StripeAccountDisconnected);

  // If account is disconnected or has disconnect error
  if (isAccountDisconnected || hasDisconnectError) {
    return (
      <Alert variant="destructive" className="p-0">
        <AlertTitle className="inline-flex gap-2 px-4 pt-4">
          <AlertTriangle size={16} className="-translate-y-px text-destructive" />
          Account Disconnected
        </AlertTitle>
        <AlertDescription className="px-4 pb-4">
          <p>
            Your Stripe account has been disconnected from our platform. You will need to reconnect
            to continue receiving payments.
          </p>
        </AlertDescription>
        <Separator />
        <ConnectStripeBtn oauthUrl={oauthUrl} className="w-full rounded-t-none shadow-none" />
      </Alert>
    );
  }

  // Regular error state with link to Stripe dashboard
  return (
    <Alert variant="destructive" className="p-0">
      <AlertTitle className="inline-flex gap-2 px-4 pt-4">
        <AlertTriangle size={16} className="-translate-y-px text-destructive" />
        Something's up with your account
      </AlertTitle>
      <div className="px-4 pb-4 text-muted-foreground">
        <p className="mb-2">
          It looks like there are some issues with your Stripe account settings. Please visit your{" "}
          <StripeDashboardButton variant="link">Stripe Dashboard</StripeDashboardButton> to resolve
          these issues.
        </p>

        {disabledReasons && disabledReasons.length > 0 && (
          <div className="mb-3 space-y-2">
            <p>These codes might hint at what's wrong:</p>
            <ul className="list-disc space-y-2 pl-4">
              {disabledReasons.map((message, index) => (
                <li key={index} className="marker:text-[14px]">
                  <span className="inline-block w-fit rounded-sm border bg-stone-150 px-1 font-mono text-xs/[18px] font-medium">
                    {message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ul className="relative flex list-disc flex-col gap-y-2 border-t p-4 text-xs text-muted-foreground">
        <p className="absolute left-2.5 top-[-7px] bg-white px-1.5 text-xxs font-medium uppercase tracking-wide">
          Error Messages
        </p>
        {messageCodes.map(async (message, index) => (
          <li key={index} className="ml-3.5 pl-0.5">
            {await getVendorStripeErrorMessage(message as ErrorMessageCode)}
          </li>
        ))}
      </ul>
      <Separator />
      <StripeDashboardButton>
        Go to Stripe Dashboard
        <ExternalLink />
      </StripeDashboardButton>
    </Alert>
  );
}
