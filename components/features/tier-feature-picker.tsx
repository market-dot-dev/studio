"use server";

import FeatureService from "@/app/services/feature-service";
import TierService, { TierWithFeatures } from "@/app/services/TierService";
import { Feature } from "@prisma/client";
import FeatureAddRemoveButton from "@/components/features/feature-add-remove-toggle";
import { Suspense } from "react";
import { Card } from "@tremor/react";
import UserService from "@/app/services/UserService";

const TierFeaturePicker = async ({ tierId }: { tierId: string }) => {
  const currentUser = await UserService.findCurrentUser();

  if (!currentUser) {
    return <div>User not found</div>;
  }
  let allTiers: TierWithFeatures[] = await TierService.findByUserIdWithFeatures(currentUser.id);
  
  allTiers = allTiers.sort((a, b) => {
    if (a.id === tierId) return -1;
    if (b.id === tierId) return 1;
    return a.price - b.price;
  });

  const tier: TierWithFeatures | undefined = allTiers.find((t) => t.id === tierId);

  if(!tier) return (<>
    <div>No tier found</div>
  </>);

  const features = await FeatureService.findByUserId(tier.userId);

  const isAttached = (tier: TierWithFeatures, feature: Feature) => {
    return tier.features?.some(f => f.id === feature.id) || false;
  }

  return (
    <Card className="mt-5">
      <h1 className="text-lg font-semibold pb-4">Features available in {tier.name}</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feature
              </th>
              {allTiers.map((t) => (
                <th key={t.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {features.map((feature) => (
              <tr key={feature.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {feature.name}
                </td>
                {allTiers.map((t) => (
                  <td key={t.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Suspense fallback={<div>Loading...</div>}>
                      <FeatureAddRemoveButton feature={feature} tier={t} isAttached={isAttached(t, feature)} />
                    </Suspense>  
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TierFeaturePicker;