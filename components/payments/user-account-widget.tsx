"use client";

import { Button, TextInput } from "@tremor/react";
import { User } from "@prisma/client";

const UserCustomerWidget = ({ user }: { user: User; }) => {
  const stripeAccountId = user?.stripeAccountId;

  return (<>
    <TextInput
      name="stripeAccountId"
      placeholder={"Stripe Account ID"}
      value={stripeAccountId || ''}
    />

    { stripeAccountId ? 
      <Button onClick={async () => window.location.href = '/maintainer/stripe-connect' } >Go to Remove</Button>
      : <Button onClick={async () => { window.location.href = '/maintainer/stripe-connect' }} >Go to Add</Button>
    }
  </>);
}

export default UserCustomerWidget;