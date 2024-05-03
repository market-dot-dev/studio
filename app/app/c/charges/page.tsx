"use client";

import { findTier } from "@/app/services/TierService";
import { findUser } from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import { refreshPaymentStatus } from "@/app/services/StripeService";

import {
  Card,
  Button,
  Text,
  Bold,
} from "@tremor/react";
import Link from "next/link";
import { findCharges } from "@/app/services/charge-service";
import { Charge, User } from "@prisma/client";
import { useEffect, useState } from "react";


const ChargeCard = ({ charge }: { charge: Charge }) => {
  const [maintainer, setMaintainer] = useState<User | undefined>(undefined);
  const [tier, setTier] = useState<any | undefined>(undefined);
  
  if (!charge || !charge.tierId) return null;

  useEffect(() => {
    findTier(charge.tierId).then(setTier);
    findUser(charge.userId).then(user => user && setMaintainer(user));
  }, [charge.tierId, charge.userId]);

  if (!tier) return null;
  if (!maintainer) return null;

  let status = {
    'succeeded': 'Paid',
    'processing': 'Processing',
  }[charge.stripeStatus] || charge.stripeStatus;

  return (<Card>
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-2 items-center">
          <Bold>{maintainer.projectName}</Bold>
        </div>
      </div>

      <Bold>Tier: {tier.name}</Bold>

      <Text>Status:&nbsp;
        { status }
      </Text>
      <Text>Description: {tier.tagline}</Text>
      <p>${tier.price} / {tier.cadence}</p>
      <p>{charge.tierVersionId}</p>
      <div className="flex flex-row space-x-2">
        <Link href={`/charges/${charge.id}`}>
          <Button>Purchase Details</Button>
        </Link>
      </div>
      <div className="flex flex-row space-x-2">
        <Button onClick={() => refreshPaymentStatus(charge.id, maintainer.id)}>Check payment status</Button>
      </div>
    </div>
  </Card>)
}

export default function SubscriptionsList({ params }: { params: { id: string } }) {
  const [charges, setCharges] = useState<Charge[]>([]);

  useEffect(() => { findCharges().then(setCharges) }, []);
  const anyCharges = charges.length > 0;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <PageHeading title="Your Purchases" />
          {charges.map(element => <ChargeCard charge={element} key={element.id} />)}
          {!anyCharges && <div className="flex flex-col space-y-2">
            <h2>No purchases</h2>
          </div>}
      </div>
    </div>
  );
}