"use server";

import { newTier } from "@/app/models/Tier";
import { getContractsByCurrentMaintainer } from "@/app/services/contract-service";
import { getCurrentUser } from "@/app/services/UserService";
import TierForm from "@/components/tiers/tier-form";

export default async function NewTierPage() {
  const contracts = await getContractsByCurrentMaintainer();
  const user = await getCurrentUser();
  const attrs = newTier();

  return (
    <div className="flex max-w-screen-xl flex-col">
      <TierForm tier={attrs} contracts={contracts} user={user!} />
    </div>
  );
}
