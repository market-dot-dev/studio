"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContractEdit from "../../../../../components/contracts/contract-edit";
import { getContractById } from "@/app/services/contract-service";
import { notFound } from "next/navigation";

export default async function ContractEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const contract = await getContractById(id);
  if (!contract || contract.maintainerId !== session.user.id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ContractEdit contract={contract} />
    </div>
  );
}
