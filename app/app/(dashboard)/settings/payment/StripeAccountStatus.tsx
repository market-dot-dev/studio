import { getVendorStripeErrorMessage } from "@/app/services/stripe/stripe-vendor-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ErrorMessageCode } from "@/types/stripe";
import { AlertTriangle, CircleCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ConnectStripeBtn } from "./ConnectStripeBtn";

interface StripeAccountStatusProps {
  canSell: boolean;
  messageCodes: string[];
  disabledReasons?: string[];
  isAccountDeauthorized?: boolean;
  reconnectUrl?: string;
}

export function StripeAccountStatus({
  canSell,
  messageCodes,
  disabledReasons,
  isAccountDeauthorized = false,
  reconnectUrl
}: StripeAccountStatusProps) {
  // Successful state
  if (canSell) {
    return (
      <Alert variant="success">
        <CircleCheck />
        <AlertTitle>Your Stripe account is connected and in good standing</AlertTitle>
        <AlertDescription>You can sell your services and receive payments.</AlertDescription>
      </Alert>
    );
  }

  // Check if account has been disconnected from Stripe's side
  const hasDisconnectError = messageCodes.includes(ErrorMessageCode.StripeAccountDisconnected);

  // If account is deauthorized or has disconnect error
  if (isAccountDeauthorized || hasDisconnectError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Account Disconnected</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>
            Your Stripe account has been disconnected from our platform. You will need to reconnect
            to continue receiving payments.
          </p>

          {reconnectUrl && <ConnectStripeBtn oauthUrl={reconnectUrl} />}
        </AlertDescription>
      </Alert>
    );
  }

  // Regular error state with link to Stripe dashboard
  return (
    <Alert variant="destructive">
      <AlertTriangle />
      <AlertTitle>Something's up with your account</AlertTitle>
      <AlertDescription className="space-y-4">
        <div>
          <p>
            It looks like there are some issues with your Stripe account settings. Please visit your{" "}
            <Link
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
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
              <h6 className="text-sm font-semibold text-foreground">Stripe Error Codes</h6>
              <p className="italic">These codes might hint at what's wrong with your account.</p>
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

        <Button asChild variant="outline">
          <Link
            href="https://dashboard.stripe.com"
            target="_blank"
            className="flex items-center gap-2"
          >
            Go to Stripe Dashboard
            <ExternalLink />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
