"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";

const UserCustomerWidget = ({ user }: { user: User; }) => {
  const stripeAccountId = user?.stripeAccountId;

  return (<>
    <Input
      name="stripeAccountId"
      placeholder={"Stripe Account ID"}
      value={stripeAccountId || ''}
    />

    {stripeAccountId 
      ? (
        <Button onClick={async () => window.location.href = '/maintainer/stripe-connect'}>
          Go to Remove
        </Button>
      )
      : (
        <Button onClick={async () => window.location.href = '/maintainer/stripe-connect' }>
          Go to Add
        </Button>
      )
    }
  </>);
}

export default UserCustomerWidget;