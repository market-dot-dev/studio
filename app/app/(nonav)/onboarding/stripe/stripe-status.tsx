import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ErrorMessageCode } from "@/types/stripe";
import { AlertTriangle, CircleCheck, CreditCard } from "lucide-react";
import Link from "next/link";

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

interface StripeStatusProps {
  stripeData: StripeData;
}

export function StripeStatus({ stripeData }: StripeStatusProps) {
  // If no Stripe history (never connected), show the neutral state
  if (!stripeData.hasStripeHistory) {
    return (
      <Alert variant="default">
        <AlertTitle className="inline-flex gap-2">
          <CreditCard size={16} className="-translate-y-px text-muted-foreground" />
          No payment method connected
        </AlertTitle>
        <AlertDescription>
          Connect Stripe to accept credit card payments for your services.
        </AlertDescription>
      </Alert>
    );
  }

  if (stripeData.canSell) {
    return (
      <Alert variant="success">
        <AlertTitle className="inline-flex gap-2">
          <CircleCheck size={16} className="-translate-y-px text-success" />
          Your Stripe account is connected and in good standing
        </AlertTitle>
        <AlertDescription>You can sell your services and receive payments.</AlertDescription>
      </Alert>
    );
  }

  const hasDisconnectError = stripeData.messageCodes.includes(
    ErrorMessageCode.StripeAccountDisconnected
  );

  if (stripeData.isAccountDeauthorized || hasDisconnectError) {
    return (
      <Alert variant="destructive">
        <AlertTitle className="inline-flex gap-2">
          <AlertTriangle size={16} className="-translate-y-px text-destructive" />
          Account Disconnected
        </AlertTitle>
        <AlertDescription className="space-y-4">
          <p>
            Your Stripe account has been disconnected from our platform. You will need to reconnect
            to continue receiving payments.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertTitle className="inline-flex gap-2">
        <AlertTriangle size={16} className="-translate-y-px text-destructive" />
        Something's up with your account
      </AlertTitle>
      <AlertDescription className="space-y-4 text-xs">
        <p>
          It looks like there are some issues with your Stripe account settings. Please visit your{" "}
          <Link
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline decoration-stone-400 underline-offset-4"
          >
            Stripe Dashboard
          </Link>{" "}
          to resolve these issues and ensure your account is fully operational.
        </p>

        <Separator />

        {stripeData.errorMessages.length > 0 && (
          <ul className="my-2 list-disc space-y-1 pl-5 last:mb-0">
            {stripeData.errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        )}

        {stripeData.disabledReasons && stripeData.disabledReasons.length > 0 && (
          <div className="mt-4 text-xs">
            <h6 className=" font-semibold text-foreground">Stripe Error Codes</h6>
            <p className="italic">These codes might hint at what's wrong with your account.</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {stripeData.disabledReasons.map((message, index) => (
                <li key={index}>
                  <span className="inline-block w-fit rounded-sm border bg-stone-150 px-1 font-mono text-xxs/[18px] font-medium">
                    {message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
