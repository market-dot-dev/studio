import { getVendorStripeErrorMessage } from "@/app/services/stripe-vendor-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ErrorMessageCode } from "@/types/stripe";
import { AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

interface StripeAccountStatusProps {
  canSell: boolean;
  messageCodes: string[];
  disabledReasons?: string[];
}

export async function StripeAccountStatus({
  canSell,
  messageCodes,
  disabledReasons
}: StripeAccountStatusProps) {
  if (canSell) {
    return (
      <Alert variant="success">
        <CheckCircle className="size-4" />
        <AlertTitle>Your Stripe account is in good standing</AlertTitle>
        <AlertDescription>You can sell your services and receive payments.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="size-4" />
      <AlertTitle>Action Required!</AlertTitle>
      <AlertDescription className="space-y-4">
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

        <div>
          <ul className="list-disc space-y-2 pl-5">
            {messageCodes.map(async (message, index) => (
              <li key={index}>{await getVendorStripeErrorMessage(message as ErrorMessageCode)}</li>
            ))}
          </ul>

          {disabledReasons && disabledReasons.length > 0 && (
            <>
              <p className="mt-2 text-sm font-medium">
                Stripe Error Codes (These specific codes provide a hint about what may be wrong with
                the account).
              </p>
              <ul className="list-disc space-y-2 pl-5">
                {disabledReasons.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <Button asChild variant="outline">
          <Link
            href="https://dashboard.stripe.com"
            target="_blank"
            className="flex items-center gap-2"
          >
            Go to Stripe Dashboard
            <ExternalLink className="size-4" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
