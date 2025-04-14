"use server";

import { getContractById } from "@/app/services/contract-service";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import ContractEdit from "../../../../../components/contracts/contract-edit";

export default async function ContractEditPage({ params }: { params?: { id: string } }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  let contract = null;
  if (params?.id) {
    contract = await getContractById(params.id);
    console.log(contract);
    if (!contract || contract.maintainerId !== session.user.id) {
      notFound();
    }
  }

  return (
    <div className="space-y-6">
      <ContractEdit contract={contract} />
    </div>
  );
}
