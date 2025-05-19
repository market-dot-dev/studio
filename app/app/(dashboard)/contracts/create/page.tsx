"use server";

import ContractEdit from "@/components/contracts/contract-edit";

export default async function ContractCreatePage() {
  return (
    <div className="space-y-6">
      <ContractEdit contract={null} />
    </div>
  );
}
