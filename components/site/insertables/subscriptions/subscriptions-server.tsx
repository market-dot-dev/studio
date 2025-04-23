import SessionService from "@/app/services/session-service";
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
  const userId = await SessionService.getCurrentUserId();

  if (!userId) {
    return (
      <h2 className="text-xl font-bold">You need to be logged in to view your subscriptions</h2>
    );
  }

  const subs = site?.userId ? ((await getSubscriptions(site.userId)) as any[]) : [];

  return <Subscriptions subscriptions={subs} />;
}
