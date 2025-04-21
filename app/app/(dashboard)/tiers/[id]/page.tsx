"use server";

import ContractService from "@/app/services/contract-service";
import { findTier } from "@/app/services/TierService";
import { getCurrentUser } from "@/app/services/UserService";
import TierForm from "@/components/tiers/tier-form";

export default async function EditTierPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const [tier, contracts] = await Promise.all([
    findTier(params.id),
    ContractService.getContractsByCurrentMaintainer()
  ]);

  if (!tier || !tier.id) return null;

  const user = await getCurrentUser();

  return (
    <div className="flex max-w-screen-xl flex-col">
      <TierForm tier={tier} contracts={contracts} user={user!} />
    </div>
  );
}
