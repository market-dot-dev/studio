import { getSubscriptions } from "@/lib/tiers/fetchers";
import Subscriptions from "./subscriptions";
import { Title } from "@tremor/react";
import SessionService from "@/app/services/SessionService";

// This is the component that will render at the frontend of the site, facing the customer
export async function SubscriptionsServer({
  site,
}: {
  site: any;
  page: any;
  props: any;
}) {
  // a user should be logged in to view his/her subscriptions
  const userId = await SessionService.getCurrentUserId();

  if (!userId) {
    return <Title>You need to be logged in to view your subscriptions</Title>;
  }

  const subs = site?.userId
    ? ((await getSubscriptions(site.userId)) as any[])
    : [];

  return <Subscriptions subscriptions={subs} />;
}
