"use client";

import { disconnectVendorStripeAccount } from "@/app/services/stripe-vendor-service";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";

import { useEffect } from "react";

// @TODO: This really should use the router, not window.location.reload()
const DisconnectStripeAccountButton = ({ user }: { user: User }) => {
  // this is to refresh the onboarding guide if it exists
  useEffect(() => {
    // call the refreshOnboarding function if it exists
    if (window && Object.prototype.hasOwnProperty.call(window, "refreshOnboarding")) {
      (window as any).refreshOnboarding();
    }
  }, []);
  return (
    <div className="mt-2">
      <Button
        variant="outline"
        disabled={!user?.stripeAccountId}
        onClick={() => disconnectVendorStripeAccount(user?.id).then(() => window.location.reload())}
      >
        Disconnect Stripe Account
      </Button>
    </div>
  );
};

export default DisconnectStripeAccountButton;
