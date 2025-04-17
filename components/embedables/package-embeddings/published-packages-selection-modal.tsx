"use client";

import { getPublishedTiers, TierWithCount } from "@/app/services/TierService";
import SkeletonLoader from "@/components/common/skeleton-loader";
import TierCard from "@/components/tiers/tier-card";
import { useEffect, useState } from "react";

export default function PublishedPackagesSelectionModal({
  initTiers,
  onSelectionChange
}: {
  initTiers?: TierWithCount[];
  onSelectionChange?: (tiers: TierWithCount[]) => void;
}) {
  const [selectedTiers, setSelectedTiers] = useState<TierWithCount[]>(initTiers || []);
  const [publishedTiers, setPublishedTiers] = useState<TierWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPublishedTiers().then((tiers) => {
      setPublishedTiers(tiers as any as TierWithCount[]);
      setIsLoading(false);
    });
  }, []);

  const toggleTier = (tier: TierWithCount) => {
    setSelectedTiers((prev) => {
      const newSelection = prev.some((t) => t.id === tier.id)
        ? prev.filter((t) => t.id !== tier.id)
        : [...prev, tier];

      // Notify parent component about selection change
      if (onSelectionChange) {
        onSelectionChange(newSelection);
      }

      return newSelection;
    });
  };

  useEffect(() => {
    console.log("SELECTED TIERS NEW:", selectedTiers);
  }, [selectedTiers]);

  return (
    <div className="w-full">
      {isLoading ? (
        <PublishedPackagesSelectionLoadingContent />
      ) : (
        <PublishedPackagesSelectionModalContent
          selectedTiers={selectedTiers}
          onTierSelect={toggleTier}
          publishedTiers={publishedTiers}
        />
      )}
    </div>
  );
}

function PublishedPackagesSelectionModalContent({
  selectedTiers,
  onTierSelect,
  publishedTiers
}: {
  selectedTiers: TierWithCount[];
  onTierSelect: (tier: TierWithCount) => void;
  publishedTiers: TierWithCount[];
}) {
  return (
    <div className="flex size-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {publishedTiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onTierSelect(tier)}
            className={`rounded-lg ${
              selectedTiers.some((t) => t.id === tier.id)
                ? "ring-swamp ring-4 transition-shadow"
                : ""
            }`}
          >
            <TierCard tier={tier} buttonDisabled={true} />
          </button>
        ))}
      </div>
    </div>
  );
}

function PublishedPackagesSelectionLoadingContent() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <SkeletonLoader className="aspect-3/4 size-full rounded-lg" />
      <SkeletonLoader className="aspect-3/4 size-full rounded-lg" />
      <SkeletonLoader className="aspect-3/4 size-full rounded-lg" />
    </div>
  );
}
