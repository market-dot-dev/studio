'use server'

import { newTier } from '@/app/models/Tier';
import ContractService from '@/app/services/contract-service';
import TierForm from '@/components/tiers/tier-form';

const attrs = newTier();

export default async function NewTierPage() {
  const contracts = await ContractService.getContractsByCurrentMaintainer();

  return (
    <div className="flex max-w-screen-xl flex-col">
      <TierForm tier={attrs} contracts={contracts} />
    </div>
  )
}