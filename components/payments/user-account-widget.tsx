"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@prisma/client";

export const UserAccountWidget = ({ user }: { user: User }) => {
  const stripeAccountId = user?.stripeAccountId;

  return (
    <>
      <Input
        name="stripeAccountId"
        placeholder={"Stripe Account ID"}
        value={stripeAccountId || ""}
      />

      {stripeAccountId ? (
        <Button onClick={async () => (window.location.href = "/maintainer/stripe-connect")}>
          Go to Remove
        </Button>
      ) : (
        <Button onClick={async () => (window.location.href = "/maintainer/stripe-connect")}>
          Go to Add
        </Button>
      )}
    </>
  );
};
