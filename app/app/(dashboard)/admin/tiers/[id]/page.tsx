import { findTier } from "@/app/services/TierService";
import PageHeading from "@/components/common/page-heading";
import { Card } from "@tremor/react";
import TierForm from "./admin-tier-form";

export default async function AdminEditTier({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const tier = await findTier(id);
  if (!tier || !tier.id) return null;

  return (
    <Card>
      <PageHeading>Admin : Edit Tier</PageHeading>
      <div>Name: {tier.name}</div>
      <TierForm tier={tier} />
    </Card>
  );
}
