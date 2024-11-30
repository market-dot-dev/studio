import TierService from "@/app/services/TierService";
import UserService from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import Subscription, { SubscriptionStates } from "@/app/models/Subscription";

import {
  Card,
  Button,
  Text,
  Bold,
} from "@tremor/react";
import Link from "next/link";
import ChargeService from "@/app/services/charge-service";
import { Charge } from "@prisma/client";

const ChargeCard = async ({ charge }: { charge: Charge }) => {
  if (!charge || !charge.tierId) return null;

  const tier = await TierService.findTier(charge.tierId!);
  if (!tier) return null;

  const maintainer = await UserService.findUser(tier.userId);
  if (!maintainer) return null;

  const status = 'paid';

  return (<Card>
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-2 items-center">
          <Bold>{maintainer.projectName}</Bold>
        </div>
      </div>

      <Bold>Tier: {tier.name}</Bold>

      <Text>Status:&nbsp;
        { status}
      </Text>
      <Text>Description: {tier.tagline}</Text>
      <p>${tier.price} / {tier.cadence}</p>
      <p>{charge.tierVersionId}</p>
      <div className="flex flex-row space-x-2">
        <Link href={`/charges/${charge.id}`}>
          <Button>Tier Details</Button>
        </Link>
      </div>
    </div>
  </Card>)
}

export default async function SubscriptionsList({ params }: { params: { id: string } }) {
  const charges = await ChargeService.findCharges() || [];
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