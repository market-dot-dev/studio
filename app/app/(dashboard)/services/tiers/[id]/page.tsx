import { findTier } from '@/app/services/TierService';
import TierFormWrapper from './TierFormWrapper';
import PageHeading from '@/components/common/page-heading';
import { Button } from '@tremor/react';

export default async function EditTierPage({ params }: { params: { id: string } }) {
  const tier = await findTier(params.id);
  if (!tier) return null;

  return (
    <div className="flex max-w-screen-xl flex-col p-8 bg-white">
      <div className="flex gap-4 mb-10 z-50">
        <div className="flex justify-between w-full bg-white">
          <PageHeading title="Edit Tier" />

          <div className="flex flex-row">
            <Button size='xs'>Save Tier</Button>
          </div>
        </div>
        <div className="md:w-[300px] text-center" >
        </div>
      </div>
      <TierFormWrapper tier={tier} />
    </div>

  );
}