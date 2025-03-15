import PageHeading from "@/components/common/page-heading";
import { Feature } from "@prisma/client";
import CancelSubscriptionButton from "../cancel-subscription-button";
import SubscriptionService from "@/app/services/SubscriptionService";
import FeatureService from "@/app/services/feature-service";
import prisma from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import UserService from "@/app/services/UserService";
import { CheckSquare2 as CheckSquare } from "lucide-react";
import { getRootUrl } from "@/lib/domain";

const formatFeatureLink = async (feature: Feature) => {
  const service = await prisma.service.findUnique({
    where: { id: feature.serviceId! },
  });

  if (!service || !service.requiresUri) return <></>;

  const uri = service.protocol
    ? `${service.protocol}${feature.uri}`
    : feature.uri;

  return (
    <>
      <Link 
        href={uri || ""} 
        className={`${!feature.isEnabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''} ${buttonVariants({ variant: "outline" })}`}
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
        <CheckSquare
          className={`mr-4 ${feature.isEnabled ? "text-green-500" : "text-gray-400"}`}
        />
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

export default async function SubscriptionDetail({
  params,
}: {
  params: { id: string };
}) {
  const subscription = await SubscriptionService.findSubscription(params.id);
  if (!subscription) return null;
  const tier = subscription.tier!;
  const maintainer = await UserService.findUser(tier.userId);
  const features = await FeatureService.findByTierId(tier.id);
  const cancelled = subscription.isCancelled();
  const resubUrl = getRootUrl(
    maintainer?.gh_username || "",
    `/checkout/${tier.id}`,
  );

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <PageHeading title={`${maintainer!.name}: ${tier?.name}`} />
        <div>{tier?.description}</div>

        {cancelled && (
          <>
            <strong>Your subscription has been cancelled.</strong>
            <div>
              You can view and resubscribe to the plan here:{" "}
              <Link href={resubUrl} className={buttonVariants({ variant: "outline" })}>View Plan</Link>
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
