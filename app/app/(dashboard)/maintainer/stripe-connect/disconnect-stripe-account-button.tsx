"use client";

import { disconnectStripeAccount } from "@/app/services/StripeService";
import { User } from "@prisma/client";
import { Button } from "@tremor/react";

const DisconnectStripeAccountButton = ({ user }: { user: User }) => {
  return (
    <div className="mt-4">
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