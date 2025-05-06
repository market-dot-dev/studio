import { getSubscriptionById } from "@/app/services/subscription-service";
import UserService from "@/app/services/UserService";
import PageHeader from "@/components/common/page-header";
import { buttonVariants } from "@/components/ui/button";
import { getRootUrl } from "@/lib/domain";
import { isCancelled } from "@/types/subscription";
import Link from "next/link";
import { CancelSubscriptionBtn } from "../cancel-subscription-btn";

// @TODO: This page needs work.

export default async function SubscriptionPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const subscription = await getSubscriptionById(params.id);
  if (!subscription) return null;
  const tier = subscription.tier!;
  const maintainer = await UserService.findUser(tier.userId);
  const cancelled = isCancelled(subscription);
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
              <CancelSubscriptionBtn subscriptionId={subscription.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
