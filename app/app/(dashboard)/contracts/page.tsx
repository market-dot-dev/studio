"use server";

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContractSettings from "./contracts-index";
import ContractService from "@/app/services/contract-service";
import PageHeading from "@/components/common/page-heading";
import PrimaryButton from "@/components/common/link-button";

export default async function ContractSettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const contracts = await ContractService.getContractsByCurrentMaintainer();

  return (
    <div className="flex max-w flex-col max-w-screen-xl space-y-12">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <PageHeading title="Contracts" />
          <p className="text-sm text-stone-500">Contracts are the terms of service for the packages you are offering, and are shown at checkout. This feature is in Beta.</p>
        </div>
        <div className="flex flex-row">
          <PrimaryButton label="New Contract" href="/contracts/create" />
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        <ContractSettings contracts={contracts} />
      </div>
    </div>
  );
}