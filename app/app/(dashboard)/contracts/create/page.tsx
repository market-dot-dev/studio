"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContractEdit from "@/components/contracts/contract-edit"

export default async function ContractCreatePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const contract = null;

  return (
    <div className="space-y-6">
      <ContractEdit contract={contract} />
    </div>
  );
}
