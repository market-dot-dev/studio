'use client'

import Tier, { newTier } from '@/app/models/Tier';
import TierForm from '@/components/tiers/tier-form';
import { Suspense, useState } from 'react';
import TierFeaturePicker from '@/components/features/tier-feature-picker';

const attrs = newTier();

export default function NewTierPage() {
  const [tier, setTier] = useState<Partial<Tier>>(attrs);

  const handleSubmit = async (tier: Tier) => {
    window.location.href = `/tiers/${tier.id}`;
  };

  return (
    <div className="flex max-w-screen-xl flex-col p-8">
      <h1>OMG</h1>
      <TierForm tier={tier} setTierObj={setTier} handleSubmit={handleSubmit} >
        <Suspense>
          <TierFeaturePicker newTier={tier as Tier} />
        </Suspense>
      </TierForm>
    </div>
  )
}