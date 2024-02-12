import { findTier } from '@/app/services/TierService';
import TierFormWrapper from './TierFormWrapper';
import { Suspense } from 'react';
import TierFeaturePicker from '@/components/features/tier-feature-picker';

export default async function EditTierPage({params} : {params: { id: string }}) {
  const tier = await findTier(params.id);
  if(!tier) return null;
  
  return (
    <div className="flex max-w-screen-xl flex-col p-8">
      <TierFormWrapper tier={tier}>
        <Suspense>
          <TierFeaturePicker tierId={tier.id || ''} />
        </Suspense>
      </TierFormWrapper>
    </div>
  );
}