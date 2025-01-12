"use client";

import { TierWithFeatures } from "@/app/services/TierService";
import DashedCard from "@/components/common/dashed-card";
import embeddables from "@/components/site/embedables";

export default function PackagesDisplay({
  site,
  selectedTiers,
}: {
  site: any;
  selectedTiers: TierWithFeatures[];
}) {
  return (
    <DashedCard>
      <embeddables.tiers.preview
        site={site}
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
