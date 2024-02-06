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
  const allTiers: TierWithFeatures[] = await TierService.findByUserIdWithFeatures(currentUser.id);
  const tier: TierWithFeatures | undefined = allTiers.find((t) => t.id === tierId);

  if(!tier) return (<>
    <div>No tier found</div>
  </>);

  const features = await FeatureService.findByUserId(tier.userId);

  const isAttached = (tier: TierWithFeatures, feature: Feature) => {
    return tier.features?.some(f => f.id === feature.id) || false;
  }

  return (
    <Card>
      <h1>Features available in {tier.name}</h1>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            {allTiers.map((t) => (
              <th key={t.id}>{t.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {features.map((feature) => (
          <tr key={feature.id}>
            <td>
              {feature.name}
            </td>
            {allTiers.map((t) => (
              <td key={t.id}>
                <Suspense fallback={<div>Loading...</div>}>
                  <FeatureAddRemoveButton feature={feature} tier={t} isAttached={isAttached(t, feature)} />
                </Suspense>  
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </Card>
  );
};

export default TierFeaturePicker;