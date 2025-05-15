"use server";

import { getContractById } from "@/app/services/contract-service";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import ContractEdit from "../../../../../components/contracts/contract-edit";

export default async function ContractEditPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const contract = await getContractById(slug);
  if (!contract || contract.maintainerId !== session.user.id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ContractEdit contract={contract} />
    </div>
  );
}
