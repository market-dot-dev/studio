"use server";

import { getContractsForCurrentOrganization } from "@/app/services/contract-service";
import { getTierById } from "@/app/services/tier-service";
import { requireUser } from "@/app/services/user-context-service";
import TierForm from "@/components/tiers/tier-form";
import { notFound } from "next/navigation";

export default async function EditTierPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const [tier, contracts] = await Promise.all([
    getTierById(params.id),
    getContractsForCurrentOrganization()
  ]);

  if (!tier || !tier.id) notFound();

  const user = await requireUser();

  return (
    <div className="flex max-w-screen-xl flex-col">
      <TierForm tier={tier} contracts={contracts} user={user} />
    </div>
  );
}
