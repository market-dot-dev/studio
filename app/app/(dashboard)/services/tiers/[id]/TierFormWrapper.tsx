"use client";

import TierForm from '@/components/tiers/tier-form';
import Tier from '@/app/models/Tier';

export default async function TierFormWrapper({ tier } : { tier: Tier }) {
  const handleSubmit = async (tier: Tier) => {
    try {
      console.log('saved successfully');
    } catch (error) {
      console.log('error saving tier', error);
    }
  };

  if(!(tier && tier.id)) return null;

  return <TierForm tier={tier} handleSubmit={handleSubmit} />
}