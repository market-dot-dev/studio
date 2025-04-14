"use client";

import { disconnectStripeAccount } from "@/app/services/StripeService";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";

import { useEffect } from "react";

const DisconnectStripeAccountButton = ({ user }: { user: User }) => {
  // this is to refresh the onboarding guide if it exists
  useEffect(() => {
    // call the refreshOnboarding function if it exists
    if (window?.hasOwnProperty("refreshOnboarding")) {
      (window as any)["refreshOnboarding"]();
    }
  }, []);
  return (
    <div className="mt-2">
      <Button
        variant="outline"
        disabled={!user?.stripeAccountId}
        onClick={() => disconnectStripeAccount(user?.id).then(() => window.location.reload())}
      >
        Disconnect Stripe Account
      </Button>
    </div>
  );
};

export default DisconnectStripeAccountButton;
