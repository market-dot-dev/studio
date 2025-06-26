import { checkVendorStripeStatus } from "@/app/services/stripe/stripe-vendor-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { Alert, AlertButton, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ErrorMessageCode } from "@/types/stripe";
import { AlertTriangle, CreditCard } from "lucide-react";

const SETTINGS_PAYMENT_PATH = "/settings/payment";

export const NoStripeBanner = async () => {
  const org = await requireOrganization();
  const { canSell, messageCodes } = await checkVendorStripeStatus(true);

  if (canSell) {
    return null;
  }

  const hasStripeHistory = !!org.stripeAccountId || org.stripeAccountDisabled;

  if (!hasStripeHistory) {
    return (
      <Alert variant="default" className="rounded-none">
        <CreditCard size={16} />
        <div className="flex flex-col justify-between gap-x-6 gap-y-3 lg:flex-row lg:items-center">
          <div>
            <AlertTitle>Connect your payment method</AlertTitle>
            <AlertDescription>
              <p>
                Connect Stripe to accept credit card payments for your services and start earning.
              </p>
            </AlertDescription>
          </div>
          <AlertButton href={SETTINGS_PAYMENT_PATH} className="w-full md:w-fit">
            Connect Stripe
          </AlertButton>
        </div>
      </Alert>
    );
  }

  const isAccountDisconnected =
    org.stripeAccountDisabled || messageCodes.includes(ErrorMessageCode.StripeAccountDisconnected);

  if (isAccountDisconnected) {
    return (
      <Alert variant="destructive" className="rounded-none">
        <AlertTriangle size={16} />
        <div className="flex flex-col justify-between gap-x-6 gap-y-3 lg:flex-row lg:items-center">
          <div>
            <AlertTitle>Account Disconnected</AlertTitle>
            <AlertDescription>
              <p>
                Your Stripe account has been disconnected from our platform. You will need to
                reconnect to continue receiving payments.
              </p>
            </AlertDescription>
          </div>
          <AlertButton href={SETTINGS_PAYMENT_PATH} className="w-full md:w-fit">
            Reconnect Stripe
          </AlertButton>
        </div>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="rounded-none">
      <AlertTriangle size={16} />
      <div className="flex flex-col justify-between gap-x-6 gap-y-3 lg:flex-row lg:items-center">
        <div>
          <AlertTitle>There's an issue with your Stripe Account</AlertTitle>
          <AlertDescription>
            <p>
              Your Stripe account has an issue that may prevent sales. Please review your settings
              to resolve this issue.
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
