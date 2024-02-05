"use client";

import { Button, TextInput } from "@tremor/react";
import { User } from "@prisma/client";
import { createProduct, destroyProduct } from "@/app/services/ProductService";
import { useState } from "react";

const UserProductWidget = ({ user }: { user: User; }) => {
  const [stripeProductId, setStripeProductId] = useState(user?.stripeProductId || '');

  return (<>
    <TextInput
      name="stripeProductId"
      placeholder={"Stripe Product ID"}
      value={stripeProductId || ''}
    />

    { user?.stripeProductId ? 
      <Button onClick={async () => { destroyProduct(user.id) }} >Destroy</Button>
      : <Button onClick={async () => { createProduct(user.id) }} >Create</Button>
    }
  </>);
}

export default UserProductWidget;