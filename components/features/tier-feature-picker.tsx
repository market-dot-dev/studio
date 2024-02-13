// tier-feature-picker.tsx
"use client";

import { TierWithFeatures, getTiersForMatrix } from "@/app/services/TierService";
import { Feature, Tier } from "@prisma/client";
import TierFeaturePickerWidget from "./tier-feature-picker-widget";
import { findByCurrentUser } from "@/app/services/feature-service";
import { useEffect, useState } from "react";

const TierFeaturePicker = ({ tierId, newTier }: { tierId?: string, newTier?: Tier }) => {
  const [tiers, setTiers] = useState<TierWithFeatures[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    getTiersForMatrix().then((tiersData) => {
      setTiers(tiersData);
    });

    findByCurrentUser().then((featuresData) => {
      setFeatures(featuresData);
    });
  }, []); // Empty dependency array means this effect runs once on mount

  const allTiers = newTier ? [newTier, ...tiers] : tiers;

  return <>
    { JSON.stringify(newTier) }
    <TierFeaturePickerWidget tiers={allTiers} features={features} />
  </>;
};

export default TierFeaturePicker;