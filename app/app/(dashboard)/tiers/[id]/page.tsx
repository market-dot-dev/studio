"use server";

import { findTier } from "@/app/services/TierService";
import ContractService from "@/app/services/contract-service";
import TierForm from "@/components/tiers/tier-form";
import FeatureService from "@/app/services/feature-service";
import { getCurrentUser } from "@/app/services/UserService";
export default async function EditTierPage({
  params,
}: {
  params: { id: string };
}) {
  // const tier = await findTier(params.id);
  // const contracts = await ContractService.getContractsByCurrentMaintainer();
  // const activeFeatures = await FeatureService.findActiveByCurrentUser();

  const [tier, contracts, activeFeatures] = await Promise.all([
    findTier(params.id),
    ContractService.getContractsByCurrentMaintainer(),
    FeatureService.findActiveByCurrentUser(),
  ]);

  if (!tier || !tier.id) return null;

  const user = await getCurrentUser();

  return (
    <div className="flex max-w-screen-xl flex-col">
      <TierForm
        tier={tier}
        contracts={contracts}
        hasActiveFeatures={!!activeFeatures?.length}
        user={user!}
      />
    </div>
  );
}
