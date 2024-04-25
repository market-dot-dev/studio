import { findTier } from '@/app/services/TierService';
import PageHeading from "@/components/common/page-heading";
import { Card } from "@tremor/react";
import TierForm from './admin-tier-form';

export default async function AdminEditTier({ params }: { params: { id: string } }) {
  const tier = await findTier(params.id);
  if (!tier || !tier.id) return null;

  return (
    <Card>
      <PageHeading>Admin : Edit Tier</PageHeading>
      <div>Name: {tier.name}</div>
      <TierForm tier={tier} />
    </Card>
  );
}