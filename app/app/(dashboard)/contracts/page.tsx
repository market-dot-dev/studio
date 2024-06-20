"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContractSettings from "./contracts-index";
import ContractService from "@/app/services/contract-service";

export default async function ContractSettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const contracts = await ContractService.getContractsByCurrentMaintainer();

  return (
    <div className="space-y-6">
      <ContractSettings contracts={contracts} />
    </div>
  );
}