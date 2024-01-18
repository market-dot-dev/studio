import SubscriptionService from "@/app/services/SubscriptionService";
import TierService from "@/app/services/TierService";
import UserService from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import { Subscription } from "@prisma/client";
import { Card } from "@tremor/react";
import CancelSubscriptionButton from "./cancel-subscription-button";

const SubscriptionCard = async ({ subscription }: { subscription: Subscription }) => {
  if(!subscription || !subscription.tierId) return null;

  const tier = await TierService.findTier(subscription.tierId!);
  if(!tier) return null;

  const maintainer = await UserService.findUser(tier.userId);
  if(!maintainer) return null;

  return (<Card>
    <div className="flex flex-col space-y-2">
      <h2>{maintainer.name} : {tier.name}</h2>
      <p>{subscription.tierVersionId}</p>
      <CancelSubscriptionButton subscription={subscription} />
    </div>
  </Card>)
}

export default async function SubscriptionsList({ params }: { params: { id: string } }) {
  const subscriptions = await SubscriptionService.findSubscriptions();

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
      <PageHeading title="Your Subscriptions" />

      <div className="flex flex-col space-y-2">
        <h2>Your active and past subscriptions</h2>
      </div>
        { subscriptions.map(element => <SubscriptionCard subscription={element} key={element.id} />) }
        { !subscriptions.length && <div className="flex flex-col space-y-2">
          <h2>No active subscriptions</h2> 
        </div> }
      </div>
    </div>
  );
}