"use server";

import { findTier } from "@/app/services/TierService";
import ContractService from "@/app/services/contract-service";
import TierForm from "@/components/tiers/tier-form";
import FeatureService from "@/app/services/feature-service";
export default async function EditTierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const [tier, contracts, activeFeatures] = await Promise.all([
    findTier(id),
    ContractService.getContractsByCurrentMaintainer(),
    FeatureService.findActiveByCurrentUser(),
  ]);

  if (!tier || !tier.id) return null;

  return (
    <div className="flex max-w-screen-xl flex-col">
      <TierForm
        tier={tier}
        contracts={contracts}
        hasActiveFeatures={!!activeFeatures?.length}
      />
    </div>
  );
}
