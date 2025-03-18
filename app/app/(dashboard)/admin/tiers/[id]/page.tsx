import { findTier } from '@/app/services/TierService';
import PageHeader from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import TierForm from './admin-tier-form';

export default async function AdminEditTier({ params }: { params: { id: string } }) {
  const tier = await findTier(params.id);
  if (!tier || !tier.id) return null;

  return (
    <div className='flex flex-col gap-6'>
      <PageHeader title="Admin : Edit Tier" />
      <div className='font-semibold text-xl'>{tier.name}</div>
      <TierForm tier={tier} />
    </div>
  );
}