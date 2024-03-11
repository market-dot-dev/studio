'use client'

import { newTier } from '@/app/models/Tier';
import TierForm from '@/components/tiers/tier-form';

const attrs = newTier();

export default function NewTierPage() {
  return (
    <div className="flex max-w-screen-xl flex-col">
      <TierForm />
    </div>
  )
}