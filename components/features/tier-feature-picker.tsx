"use server";
// tier-feature-picker.tsx

import FeatureService from "@/app/services/feature-service";
import TierService, { TierWithFeatures } from "@/app/services/TierService";
import { Feature } from "@prisma/client";
import UserService from "@/app/services/UserService";
import TierFeaturePickerWidget from "./tier-feature-picker-widget";

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

  return <TierFeaturePickerWidget tiers={allTiers} features={features} />;
};

export default TierFeaturePicker;