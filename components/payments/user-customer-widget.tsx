"use client";

import { User } from "@prisma/client";
//import { createStripeCustomerById, clearStripeCustomerById } from "@/app/services/UserService";
import { useEffect, useState } from "react";
import Customer from "@/app/models/Customer";

const UserCustomerWidget = ({ user, maintainer }: { user: User; maintainer: User }) => {
  const [customer, setCustomer] = useState<Customer>();

  useEffect(() => {
    if(user && maintainer && maintainer.stripeAccountId) {
      setCustomer(new Customer(user, maintainer.id, maintainer.stripeAccountId));
    }
  }, [user, maintainer]);

  return <></>;
  /*
  return (<>
    <TextInput
      name="stripeCustomerId"
      placeholder={"Stripe Customer ID"}
      value={stripeCustomerId || ''}
    />

    {
    { user?.stripeCustomerId ? 
      <Button onClick={async () => clearStripeCustomerById(user.id) } >Destroy</Button>
      : <Button onClick={async () => createStripeCustomerById(user.id) } >Create</Button>
    }}
  </>);
  */
}

export default UserCustomerWidget;