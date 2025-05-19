import { requireUserSession } from "@/app/services/user-context-service";
import { getSubscriptions } from "@/lib/tiers/fetchers";
import Subscriptions from "./subscriptions";

// This is the component that will render at the frontend of the site, facing the customer
export async function SubscriptionsServer({
  site,
  page,
  ...props
}: {
  site: any;
  page: any;
  props: any;
}) {
  // a user should be logged in to view his/her subscriptions
  await requireUserSession();

  const subs = site?.userId ? ((await getSubscriptions(site.userId)) as any[]) : [];

  return <Subscriptions subscriptions={subs} />;
}
