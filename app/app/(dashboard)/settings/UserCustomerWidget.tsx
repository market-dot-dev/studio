"use client";

import { Button, TextInput } from "@tremor/react";
import { User } from "@prisma/client";
import { createStripeCustomerById } from "@/app/services/UserService";
import { useState } from "react";

const UserCustomerWidget = ({ user }: { user: User; }) => {
  const [stripeCustomerId, setStripeCustomerId] = useState(user?.stripeCustomerId || '');

  return (<>
    <TextInput
      name="stripeCustomerId"
      placeholder={"Stripe Customer ID"}
      value={stripeCustomerId || ''}
    />

    { user?.stripeCustomerId ? 
      <Button onClick={async () => { }} >Destroy</Button>
      : <Button onClick={async () => { createStripeCustomerById(user.id) }} >Create</Button>
    }
  </>);
}

export default UserCustomerWidget;