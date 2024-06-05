"use server";

import { findTier } from '@/app/services/TierService';
import ContractService from '@/app/services/contract-service';
import TierForm from '@/components/tiers/tier-form';

export default async function EditTierPage({params} : {params: { id: string }}) {
  const tier = await findTier(params.id);
  const contracts = await ContractService.getContractsByCurrentMaintainer();
  
  if(!tier || !tier.id) return null;
  
  return (
    <div className="flex max-w-screen-xl flex-col">
      <TierForm tier={tier} contracts={contracts} />
    </div>
  );
}