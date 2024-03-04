import TierService from "@/app/services/TierService";
import UserService from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import Subscription, { SubscriptionStates } from "@/app/models/Subscription";

import {
  Card,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Button,
  Text,
  Bold,
} from "@tremor/react";
import SubscriptionService from "@/app/services/SubscriptionService";
import Link from "next/link";

const SubscriptionCard = async ({ subscription }: { subscription: Subscription }) => {
  if (!subscription || !subscription.tierId) return null;

  const tier = await TierService.findTier(subscription.tierId!);
  if (!tier) return null;

  const maintainer = await UserService.findUser(tier.userId);
  if (!maintainer) return null;

  return (<Card>
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-2 items-center">
          <Bold>{maintainer.projectName}</Bold>
        </div>
      </div>

      <Bold>Tier: {tier.name}</Bold>

      <Text>Description: {tier.tagline}</Text>
      <p>${tier.price} / month</p>
      <p>{subscription.tierVersionId}</p>
      <div className="flex flex-row space-x-2">
        <Link href={`/subscriptions/${subscription.id}`}>
          <Button>Tier Details</Button>
        </Link>
      </div>
    </div>
  </Card>)
}

export default async function SubscriptionsList({ params }: { params: { id: string } }) {
  const subscriptions = await SubscriptionService.findSubscriptions();

  const activeSubscriptions = subscriptions && subscriptions.filter(sub => sub.isActive()) || [];
  const pastSubscriptions = subscriptions && subscriptions.filter(sub => sub.isCancelled()) || [];

  const anyActive = activeSubscriptions.length > 0;
  const anyPast = pastSubscriptions.length > 0;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <PageHeading title="Your Subscriptions" />
        <TabGroup defaultIndex={0}>
          <TabList>
            <Tab>Active</Tab>
            <Tab>Past</Tab>
          </TabList>
          <TabPanels className="pt-6">
            <TabPanel>
              {activeSubscriptions.map(element => <SubscriptionCard subscription={element} key={element.id} />)}
              {!anyActive && <div className="flex flex-col space-y-2">
                <h2>No active subscriptions</h2>
              </div>}
            </TabPanel>
            <TabPanel>
              {pastSubscriptions.map(element => <SubscriptionCard subscription={element} key={element.id} />)}
              {!anyPast && <div className="flex flex-col space-y-2">
                <h2>No past subscriptions</h2>
              </div>}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}