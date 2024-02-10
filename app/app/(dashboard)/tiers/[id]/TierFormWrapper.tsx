"use client";

import TierForm from '@/components/tiers/tier-form';
import Tier from '@/app/models/Tier';

export default function TierFormWrapper({ tier } : { tier: Tier }) {
  const handleSubmit = async (tier: Tier) => {
    window.location.href = `/tiers/${tier.id}`;
  };

  if(!(tier && tier.id)) return null;

  return <TierForm tier={tier} handleSubmit={handleSubmit} />
}