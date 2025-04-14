import SubscriptionService from "@/app/services/SubscriptionService";
import UserService from "@/app/services/UserService";
import FeatureService from "@/app/services/feature-service";
import PageHeader from "@/components/common/page-header";
import { buttonVariants } from "@/components/ui/button";
import { getRootUrl } from "@/lib/domain";
import prisma from "@/lib/prisma";
import { Feature } from "@prisma/client";
import { CheckSquare2 as CheckSquare } from "lucide-react";
import Link from "next/link";
import CancelSubscriptionButton from "../cancel-subscription-button";

const formatFeatureLink = async (feature: Feature) => {
  const service = await prisma.service.findUnique({
    where: { id: feature.serviceId! }
  });

  if (!service || !service.requiresUri) return <></>;

  const uri = service.protocol ? `${service.protocol}${feature.uri}` : feature.uri;

  return (
    <>
      <Link
        href={uri || ""}
        className={`${!feature.isEnabled ? "pointer-events-none cursor-not-allowed opacity-50" : ""} ${buttonVariants({ variant: "outline" })}`}
      >
        {feature.name || service.name}
      </Link>
    </>
  );
};

const FeatureAction = async ({ feature }: { feature: Feature }) => {
  const button = await formatFeatureLink(feature);
  return (
    <div className="mb-2 flex w-full items-start justify-between rounded-md border-2 p-4 xl:w-3/4">
      <div className="flex items-start">
        <CheckSquare className={`mr-4 ${feature.isEnabled ? "text-green-500" : "text-gray-400"}`} />
        <div className="ml-4">
          <div className="flex flex-col">
            <h4 className="font-semibold">{feature.name}</h4>
            <p className="text-sm text-gray-600">{feature.description}</p>
            <div>{feature.uri}</div>
          </div>
        </div>
      </div>
      <div>{button}</div>
    </div>
  );
};

export default async function SubscriptionPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const subscription = await SubscriptionService.findSubscription(params.id);
  if (!subscription) return null;
  const tier = subscription.tier!;
  const maintainer = await UserService.findUser(tier.userId);
  const features = await FeatureService.findByTierId(tier.id);
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
              {features.map((f) => (
                <FeatureAction feature={f} key={f.id} />
              ))}

              <strong>Manage your Subscription</strong>
              <CancelSubscriptionButton subscriptionId={subscription.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
