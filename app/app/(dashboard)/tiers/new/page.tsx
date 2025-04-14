"use server";

import { newTier } from "@/app/models/Tier";
import ContractService from "@/app/services/contract-service";
import { getCurrentUser } from "@/app/services/UserService";
import TierForm from "@/components/tiers/tier-form";

const attrs = newTier();

export default async function NewTierPage() {
  const contracts = await ContractService.getContractsByCurrentMaintainer();
  const user = await getCurrentUser();

  return (
    <div className="flex max-w-screen-xl flex-col">
      <TierForm tier={attrs} contracts={contracts} user={user!} />
    </div>
  );
}
