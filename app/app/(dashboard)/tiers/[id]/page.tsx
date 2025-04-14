"use server";

import ContractService from "@/app/services/contract-service";
import FeatureService from "@/app/services/feature-service";
import { findTier } from "@/app/services/TierService";
import { getCurrentUser } from "@/app/services/UserService";
import TierForm from "@/components/tiers/tier-form";
export default async function EditTierPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // const tier = await findTier(params.id);
  // const contracts = await ContractService.getContractsByCurrentMaintainer();
  // const activeFeatures = await FeatureService.findActiveByCurrentUser();

  const [tier, contracts, activeFeatures] = await Promise.all([
    findTier(params.id),
    ContractService.getContractsByCurrentMaintainer(),
    FeatureService.findActiveByCurrentUser()
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
