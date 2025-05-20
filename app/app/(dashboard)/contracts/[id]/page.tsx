"use server";

import { getContract } from "@/app/services/contract-service";
import { requireUserSession } from "@/app/services/user-context-service";
import { notFound } from "next/navigation";
import ContractEdit from "../../../../../components/contracts/contract-edit";

export default async function ContractEditPage(props: { params: Promise<{ id: string }> }) {
  const { id: slug } = await props.params;
  const user = await requireUserSession();

  const contract = await getContract(slug);
  if (!contract || contract.organizationId !== user.currentOrgId) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ContractEdit contract={contract} />
    </div>
  );
}
