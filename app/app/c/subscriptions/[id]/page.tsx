import PageHeading from "@/components/common/page-heading";
import { Feature } from "@prisma/client";
import CancelSubscriptionButton from "../cancel-subscription-button";
import SubscriptionService from "@/app/services/SubscriptionService";
import FeatureService from "@/app/services/feature-service";
import prisma from "@/lib/prisma";
import LinkButton from "@/components/common/link-button";
import UserService from "@/app/services/UserService";
import {
  CheckSquare2 as CheckSquare,
} from "lucide-react";
import { Bold } from "@tremor/react";
import { SubscriptionStates } from "@/app/models/Subscription";
import DomainService from "@/app/services/domain-service";

const formatFeatureLink = async (feature: Feature) => {
  const service = await prisma.service.findUnique({ where: { id: feature.serviceId! }});

  if(!service || !service.requiresUri) return <></>;

  const uri = service.protocol ? `${service.protocol}${feature.uri}` : feature.uri;
  
  return <>
    <LinkButton disabled={!feature.isEnabled} href={uri || ''} label={feature.name || service.name}/>
  </>
}

const FeatureAction = async ({ feature }: { feature: Feature }) => {
  const button = await formatFeatureLink(feature);
  return (
    <div className="flex items-start justify-between mb-2 p-4 border-2 rounded-md w-full xl:w-3/4">
      <div className="flex items-start">
        <CheckSquare className={`mr-4 ${feature.isEnabled ? 'text-green-500' : 'text-gray-400'}`} />
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

export default async function SubscriptionDetail({ params }: { params: { id: string } }) {
  const subscription = await SubscriptionService.findSubscription(params.id);
  if(!subscription) return null;
  const tier = subscription.tier!;
  const maintainer = await UserService.findUser(tier.userId);
  const features = await FeatureService.findByTierId(tier.id);
  const cancelled = subscription.isCancelled();
  const resubUrl = DomainService.getRootUrl(maintainer?.gh_username || '', `/checkout/${tier.id}`);

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <PageHeading title={`${maintainer!.name}: ${tier?.name}`} />
        <div>{ tier?.description }</div>

        { cancelled && <>
          <Bold>Your subscription has been cancelled.</Bold>
          <div>
            You can view and resubscribe to the plan here: <LinkButton href={resubUrl} label="View Plan" />
          </div>
        </> }

        { !cancelled && <>
          <div className="flex flex-col space-y-2">
            { features.map(f => <FeatureAction feature={f} key={f.id} />) }

            <Bold>Manage your Subscription</Bold>
            <CancelSubscriptionButton subscription={subscription} />
          </div>
        </> }
      </div>
    </div>
  );
}