'use client'

import PageHeading from '@/components/common/page-heading';
import Tier, { newTier } from '@/app/models/Tier';
import TierForm from '@/components/tiers/tier-form';
import { useState } from 'react';
import { Button } from '@tremor/react';

const attrs = newTier();

export default function NewTierPage() {
  const [tier, setTier] = useState<Partial<Tier>>(attrs);

  const handleSubmit = async (tier: Tier) => {
    window.location.href = `/services/tiers/${tier.id}`;
  };

  return (
    <div className="flex max-w-screen-xl flex-col p-8 bg-white">
      <div className="flex gap-4 mb-10 z-50">
        <div className="flex justify-between w-full bg-white">
          <PageHeading title="New Tier" />

          <div className="flex flex-row">
            <Button size='xs'>Save Tier</Button>
          </div>
        </div>
        <div className="md:w-[300px] text-center" >
        </div>
      </div>


      <TierForm tier={tier} handleSubmit={handleSubmit} />
    </div>

  )
}