"use server";

import { getContractsForCurrentOrganization } from "@/app/services/contract-service";
import { requireUserSession } from "@/app/services/user-context-service";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ContractSettings from "./contracts-index";

export default async function ContractSettingsPage() {
  const user = await requireUserSession();
  const contracts = await getContractsForCurrentOrganization();

  return (
    <div className="max-w flex max-w-screen-xl flex-col space-y-10">
      <PageHeader
        title="Contracts"
        description="Contracts are the terms of service for the packages you are
          offering, and are shown at checkout. This feature is in Beta."
        actions={[
          <Button key="new-contract" asChild>
            <Link href="/contracts/create">New Contract</Link>
          </Button>
        ]}
      />

      <div className="flex flex-col space-y-6">
        <ContractSettings contracts={contracts} currentUser={user} />
      </div>
    </div>
  );
}
