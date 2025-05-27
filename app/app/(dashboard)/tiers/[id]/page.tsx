"use server";

import { getContractsForCurrentOrganization } from "@/app/services/contract-service";
import { getTierById } from "@/app/services/tier/tier-service";
import { requireOrganization } from "@/app/services/user-context-service";
import TierForm from "@/components/tiers/tier-form";
import { notFound } from "next/navigation";

export default async function EditTierPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const [tier, contracts] = await Promise.all([
    getTierById(params.id),
    getContractsForCurrentOrganization()
  ]);

  if (!tier || !tier.id) notFound();

  const org = await requireOrganization();

  return (
    <div className="flex max-w-screen-xl flex-col">
      <TierForm tier={tier} contracts={contracts} org={org} />
    </div>
  );
}
