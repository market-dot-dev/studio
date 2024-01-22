import { findTier } from '@/app/services/TierService';
import TierFormWrapper from './TierFormWrapper';
import PageHeading from '@/components/common/page-heading';

export default async function EditTierPage({params} : {params: { id: string }}) {
  const tier = await findTier(params.id);
  if(!tier) return null;
  
  return (
    <div className="flex max-w-screen-xl flex-col p-8">
    <PageHeading title="Edit Tier" />
      <TierFormWrapper tier={tier} />
    </div>
  );
}