"use server";

import { newTier } from "@/app/models/Tier";
import { getContractsForCurrentOrganization } from "@/app/services/contract-service";
import { requireOrganization } from "@/app/services/user-context-service";
import TierForm from "@/components/tiers/tier-form";

export default async function NewTierPage() {
  const contracts = await getContractsForCurrentOrganization();
  const org = await requireOrganization();
  const attrs = newTier();

  return (
    <div className="flex max-w-screen-xl flex-col">
      <TierForm tier={attrs} contracts={contracts} org={org} />
    </div>
  );
}
