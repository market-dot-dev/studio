import PageHeading from "@/components/common/page-heading";
import { Feature } from "@prisma/client";
import FeatureService from "@/app/services/feature-service";
import prisma from "@/lib/prisma";
import LinkButton from "@/components/common/link-button";
import UserService from "@/app/services/UserService";
import { CheckSquare2 as CheckSquare } from "lucide-react";

import DomainService from "@/app/services/domain-service";
import ChargeService from "@/app/services/charge-service";
import TierService from "@/app/services/TierService";

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
      <LinkButton
        disabled={!feature.isEnabled}
        href={uri || ""}
        label={feature.name || service.name}
      />
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

export default async function ChargeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const charge = await ChargeService.findCharge(id);
  if (!charge) return null;
  const tier = await TierService.findTier(charge.tierId);
  if (!tier) return null;
  const maintainer = await UserService.findUser(tier.userId);
  const features = await FeatureService.findByTierId(tier.id);

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex flex-col space-y-6">
        <PageHeading title={`${maintainer!.name}: ${tier?.name}`} />
        <div>{tier?.description}</div>
        <div className="flex flex-col space-y-2">
          {features.map((f) => (
            <FeatureAction feature={f} key={f.id} />
          ))}
        </div>
        <div>
          Paid ${tier.price} on{" "}
          {new Date(charge.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
