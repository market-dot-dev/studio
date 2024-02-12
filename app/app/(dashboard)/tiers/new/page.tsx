'use client'

import PageHeading from '@/components/common/page-heading';
import Tier, { newTier } from '@/app/models/Tier';
import TierForm from '@/components/tiers/tier-form';
import { useState } from 'react';

const attrs = newTier();

export default function NewTierPage() {
  const [tier, setTier] = useState<Partial<Tier>>(attrs);

  const handleSubmit = async (tier: Tier) => {
    window.location.href = `/tiers/${tier.id}`;
  };

  return (
    <div className="flex max-w-screen-xl flex-col p-8">
      <TierForm tier={tier} handleSubmit={handleSubmit} />
    </div>
  )
}