import { getVendorStripeErrorMessage } from "@/app/services/stripe/stripe-vendor-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ErrorMessageCode } from "@/types/stripe";
import { AlertTriangle, CircleCheck, CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ConnectStripeBtn } from "./connect-stripe-btn";
import { Separator } from "@/components/ui/separator";

function StripeDashboardButton() {
  return (
    <Button asChild variant="outline" className="shadow-none rounded-t-none w-full">
      <Link href="https://dashboard.stripe.com" target="_blank" className="flex items-center gap-2">
        Go to Stripe Dashboard
        <ExternalLink className="size-3.5" />
      </Link>
    </Button>
  );
}

interface StripeAccountStatusProps {
  canSell: boolean;
  messageCodes: string[];
  disabledReasons?: string[];
  isAccountDeauthorized?: boolean;
  reconnectUrl?: string;
  oauthUrl: string;
  hasStripeHistory: boolean;
}

export function StripeAccountStatus({
  canSell,
  messageCodes,
  disabledReasons,
  isAccountDeauthorized = false,
  reconnectUrl,
  oauthUrl,
  hasStripeHistory
}: StripeAccountStatusProps) {
  // If no Stripe history (never connected), show connect button
  if (!hasStripeHistory) {
    return (
      <Alert variant="default" className="p-0">
        <AlertTitle className="inline-flex gap-2 pt-4 px-4">
          <CreditCard size={16} className="-translate-y-px text-muted-foreground" />
          No payment method connected
        </AlertTitle>
        <AlertDescription className="px-4 pb-4">
          Connect Stripe to accept credit card payments for your services.
        </AlertDescription>
        <Separator />
        <ConnectStripeBtn oauthUrl={oauthUrl} className="shadow-none rounded-t-none w-full" />
      </Alert>
    );
  }

  // Successful state
  if (canSell) {
    return (
      <Alert variant="success" className="p-0">
        <AlertTitle className="inline-flex gap-2 pt-4 px-4">
          <CircleCheck size={18} className="-m-px fill-success stroke-white -translate-y-px text-success" />
          Your Stripe account is connected and in good standing
        </AlertTitle>
        <AlertDescription className="px-4 pb-4">
          You can sell your services and receive payments.
        </AlertDescription>
        <Separator />
        <StripeDashboardButton />
      </Alert>
    );
  }

  // Check if account has been disconnected from Stripe's side
  const hasDisconnectError = messageCodes.includes(ErrorMessageCode.StripeAccountDisconnected);

  // If account is deauthorized or has disconnect error
  if (isAccountDeauthorized || hasDisconnectError) {
    return (
      <Alert variant="destructive" className="p-0">
        <AlertTitle className="inline-flex gap-2 pt-4 px-4">
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
        {reconnectUrl && <ConnectStripeBtn oauthUrl={reconnectUrl} className="shadow-none rounded-t-none w-full" />}
      </Alert>
    );
  }

  // Regular error state with link to Stripe dashboard
  return (
    <Alert variant="destructive" className="p-0">
      <AlertTitle className="inline-flex gap-2 pt-4 px-4">
        <AlertTriangle size={16} className="-translate-y-px text-destructive" />
        Something's up with your account
      </AlertTitle>
      <div className="px-4 pb-4 !text-xs/4 text-muted-foreground">
        <p>
          It looks like there are some issues with your Stripe account settings. Please visit your{" "}
          <Link
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline decoration-muted-foreground underline-offset-2"
          >
            Stripe Dashboard
          </Link>{" "}
          to resolve these issues and ensure your account is fully operational.
        </p>

        <ul className="my-2 list-disc space-y-1 pl-5">
          {messageCodes.map(async (message, index) => (
            <li key={index}>{await getVendorStripeErrorMessage(message as ErrorMessageCode)}</li>
          ))}
        </ul>

        {disabledReasons && disabledReasons.length > 0 && (
          <div className="mt-4">
            <h6 className="text-xs font-semibold text-foreground">Stripe Error Codes</h6>
            <p>These codes might hint at what's wrong with your account:</p>
            <ul className="my-2 list-disc space-y-1 pl-5">
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
      <Separator />
      <StripeDashboardButton />
    </Alert >
  );
}
