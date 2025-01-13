"use client";

import { TierWithFeatures } from "@/app/services/TierService";
import DashedCard from "@/components/common/dashed-card";
import embeddables from "@/components/site/embedables";

export default function PackagesDisplay({
  siteUrl,
  selectedTiers,
}: {
  siteUrl: string;
  selectedTiers: TierWithFeatures[];
}) {
  return (
    <DashedCard>
      <embeddables.tiers.preview
        site={siteUrl}
        settings={{
          darkmode: false,
          tiers: selectedTiers.map((tier) => tier.id),
        }}
        tiers={selectedTiers}
        hasActiveFeatures={false}
      />
    </DashedCard>
  );
}
