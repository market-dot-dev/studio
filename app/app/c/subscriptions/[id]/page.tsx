import PageHeading from "@/components/common/page-heading";
import { Feature } from "@prisma/client";
import CancelSubscriptionButton from "../cancel-subscription-button";
import SubscriptionService from "@/app/services/SubscriptionService";
import TierFeatureList from "@/components/features/tier-feature-list";
import FeatureService from "@/app/services/feature-service";
import prisma from "@/lib/prisma";
import LinkButton from "@/components/common/link-button";
import UserService from "@/app/services/UserService";

const formatFeatureLink = async (feature: Feature) => {
  const service = await prisma.service.findUnique({ where: { id: feature.serviceId! }});

  console.log(service);

  if(!service || !service.requiresUri) return <></>;

  const uri = service.protocol ? `${service.protocol}${feature.uri}` : feature.uri;

  return <>
    <LinkButton href={uri || ''} label={feature.name || service.name}/>
  </>
}

const FeatureAction = async ({ feature }: { feature: Feature }) => {
  return (<>
    <div className="flex flex-row space-x-2">
      <div>{feature.name}</div>
      <div>{feature.description}</div>
      <div>{feature.uri}</div>
      <div>{ await formatFeatureLink(feature) }</div>
    </div>
  </>);
};

export default async function SubscriptionDetail({ params }: { params: { id: string } }) {
  const subscription = await SubscriptionService.findSubscription(params.id);
  if(!subscription) return null;
  const tier = subscription.tier!;
  const maintainer = await UserService.findUser(tier.userId);
  const features = await FeatureService.findByTierId(tier.id);

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <PageHeading title={`${maintainer!.name}: ${tier?.name}`} />
        <div>{ tier?.description }</div>

        <div className="flex flex-col space-y-2">
          <TierFeatureList features={features} />
          { features.filter(f => f.isEnabled).map(f => <FeatureAction feature={f} key={f.id} />) }
          <CancelSubscriptionButton subscription={subscription} />
        </div>
      </div>
    </div>
  );
}