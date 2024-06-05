"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContractShow from "./contract-show";
import { getContractById } from "@/app/services/contract-service";
import { notFound } from "next/navigation";

export default async function ContractShowPage({ params } : { params: { id: string; }}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const contract = await getContractById(params.id);

  if (!contract) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ContractShow contract={contract} />
    </div>
  );
}