"use client";

import { disconnectStripeAccount } from "@/app/services/StripeService";
import { User } from "@prisma/client";
import { Button } from "@tremor/react";
import { useEffect } from "react";

const DisconnectStripeAccountButton = ({ user }: { user: User }) => {
  
  // this is to refresh the onboarding guide if it exists
  useEffect(() => {
    // call the refreshOnboarding function if it exists
    if(window?.hasOwnProperty('refreshOnboarding')) {
      (window as any)['refreshOnboarding']();
    }
  },  [])
  return (
    <div className="mt-2">
      <Button
        onClick={() => disconnectStripeAccount(user?.id).then(() => window.location.reload())}
        disabled={!user?.stripeAccountId}
      >
        Disconnect Stripe Account
      </Button>
    </div>
  );
};

export default DisconnectStripeAccountButton;