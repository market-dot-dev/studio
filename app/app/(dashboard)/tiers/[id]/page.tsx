import { findTier } from '@/app/services/TierService';
import TierForm from '@/components/tiers/tier-form';

export default async function EditTierPage({params} : {params: { id: string }}) {
  const tier = await findTier(params.id);
  if(!tier || !tier.id) return null;
  
  return (
    <div className="flex max-w-screen-xl flex-col p-8">
      <TierForm tier={tier} />
    </div>
  );
}