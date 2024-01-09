"use client";

import { Button, NumberInput, TextInput } from "@tremor/react";
import { createStripePriceById, destroyStripePriceById } from "@/app/services/TierService";
import { useState } from "react";

const TierPriceWidget = ({ tierId, price: iPrice, stripePriceId: iStripePriceId }: { tierId: string, price: number; stripePriceId: string; }) => {
  const [stripePriceId, setStripePriceId] = useState(iStripePriceId || '');
  const [price, setPrice] = useState<number>(iPrice || 0);

  return (<>
    <TextInput
      name="stripeProductId"
      placeholder={"Stripe Product ID"}
      value={stripePriceId || ''}
    />

    <NumberInput
      name="price"
      placeholder={"price"}
      value={price || 0}
    />

    { stripePriceId ? 
      <Button onClick={async () => { destroyStripePriceById(tierId) }} >Destroy</Button> : 
      <Button onClick={async () => { createStripePriceById(tierId) }} >Create</Button>
    }
  </>);
}

export default TierPriceWidget;