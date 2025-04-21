import SubscriptionService from "@/app/services/SubscriptionService";
import UserService from "@/app/services/UserService";
import PageHeader from "@/components/common/page-header";
import { buttonVariants } from "@/components/ui/button";
import { getRootUrl } from "@/lib/domain";
import Link from "next/link";
import CancelSubscriptionButton from "../cancel-subscription-button";

export default async function SubscriptionPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const subscription = await SubscriptionService.findSubscription(params.id);
  if (!subscription) return null;
  const tier = subscription.tier!;
  const maintainer = await UserService.findUser(tier.userId);
  const cancelled = subscription.isCancelled();
  const resubUrl = getRootUrl(maintainer?.gh_username || "", `/checkout/${tier.id}`);

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10 p-10">
      <PageHeader
        title={`${maintainer!.name}: ${tier?.name}`}
        description={tier?.description || undefined}
      />
      <div className="flex flex-col space-y-6">
        {cancelled && (
          <>
            <strong>Your subscription has been cancelled.</strong>
            <div>
              You can view and resubscribe to the plan here:{" "}
              <Link href={resubUrl} className={buttonVariants({ variant: "outline" })}>
                View Plan
              </Link>
            </div>
          </>
        )}

        {!cancelled && (
          <>
            <div className="flex flex-col space-y-2">
              <strong>Manage your Subscription</strong>
              <CancelSubscriptionButton subscriptionId={subscription.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
