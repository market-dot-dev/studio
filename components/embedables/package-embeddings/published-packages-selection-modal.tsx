"use client";

import { Button } from "@/components/ui/button";
import {
  getPublishedTiers,
  TierWithFeatures,
} from "@/app/services/TierService";
import { useEffect, useState } from "react";
import SkeletonLoader from "@/components/common/skeleton-loader";
import TierCard from "@/components/tiers/tier-card";

export default function PublishedPackagesSelectionModal({
  hide,
  initTiers,
  onDoneCallback,
}: {
  hide: () => void;
  initTiers?: TierWithFeatures[];
  onDoneCallback: (tiers: TierWithFeatures[]) => void;
}) {
  const [selectedTiers, setSelectedTiers] = useState<TierWithFeatures[]>(
    initTiers || [],
  );
  const [publishedTiers, setPublishedTiers] = useState<TierWithFeatures[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPublishedTiers().then((tiers) => {
      setPublishedTiers(tiers as any as TierWithFeatures[]);
      setIsLoading(false);
    });
  }, []);

  const toggleTier = (tier: TierWithFeatures) => {
    setSelectedTiers((prev) =>
      prev.some((t) => t.id === tier.id)
        ? prev.filter((t) => t.id !== tier.id)
        : [...prev, tier],
    );
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <PublishedPackagesSelectionLoadingContent />
      ) : (
        <PublishedPackagesSelectionModalContent
          selectedTiers={selectedTiers}
          onTierSelect={toggleTier}
          publishedTiers={publishedTiers}
          onDone={() => {
            onDoneCallback(selectedTiers);
            hide();
          }}
        />
      )}
    </div>
  );
}

function PublishedPackagesSelectionModalContent({
  selectedTiers,
  onTierSelect,
  publishedTiers,
  onDone,
}: {
  selectedTiers: TierWithFeatures[];
  onTierSelect: (tier: TierWithFeatures) => void;
  publishedTiers: TierWithFeatures[];
  onDone: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-4 p-10">
      <div className="grid grid-cols-1 gap-2 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {publishedTiers.map((tier) => (
          <div
            key={tier.id}
            onClick={() => onTierSelect(tier)}
            className={`cursor-pointer rounded-lg ${
              selectedTiers.some((t) => t.id === tier.id)
                ? "border-2 border-black"
                : ""
            }`}
          >
            <TierCard tier={tier} buttonDisabled={true} />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button size="lg" onClick={onDone}>Done</Button>
      </div>
    </div>
  );
}

function PublishedPackagesSelectionLoadingContent() {
  return (
    <div className="grid grid-cols-1 gap-2 p-10 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <SkeletonLoader className="h-96 w-full rounded-lg" />
      <SkeletonLoader className="h-96 w-full rounded-lg" />
      <SkeletonLoader className="h-96 w-full rounded-lg" />
    </div>
  );
}
