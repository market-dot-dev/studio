import TierService from "@/app/services/TierService";
import UserService from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import { Subscription } from "@prisma/client";
import { Card } from "@tremor/react";
import CancelSubscriptionButton from "./cancel-subscription-button";
import SubscriptionService from "@/app/services/SubscriptionService";
import LinkButton from "@/components/common/link-button";
import { Github } from "lucide-react";

const SubscriptionCard = async ({ subscription }: { subscription: Subscription }) => {
  if(!subscription || !subscription.tierId) return null;

  const tier = await TierService.findTier(subscription.tierId!);
  if(!tier) return null;

  const maintainer = await UserService.findUser(tier.userId);
  if(!maintainer) return null;

  return (<Card>
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-2 items-center">
          <Github size={32} /> <b>widgetbot</b>
        </div>
      </div>

      <h2>{maintainer.name} : {tier.name}</h2>
      {maintainer.gh_username && <p>Maintainer: {maintainer.gh_username}</p>}
      <p>{tier.description}</p>
      <p>${tier.price} / month</p>
      <p>{subscription.tierVersionId}</p>
      <div className="flex flex-row space-x-2">
      <LinkButton label="Details" href={`/subscriptions/${subscription.id}`} />
        <CancelSubscriptionButton subscription={subscription} />
      </div>
    </div>
  </Card>)
}

export default async function SubscriptionsList({ params }: { params: { id: string } }) {
  const subscriptions = await SubscriptionService.findSubscriptions();
  const anySubscriptions = subscriptions && subscriptions.length > 0;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
      <PageHeading title="Your Subscriptions" />

      <div className="flex flex-col space-y-2">
        <h2>Your active and past subscriptions</h2>
      </div>
        { (subscriptions || []).map(element => <SubscriptionCard subscription={element} key={element.id} />) }
        { !anySubscriptions && <div className="flex flex-col space-y-2">
          <h2>No active subscriptions</h2> 
        </div> }
      </div>
    </div>
  );
}