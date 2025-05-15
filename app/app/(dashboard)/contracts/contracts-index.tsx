"use client";

import { SessionUser } from "@/app/models/Session";
import { DataTable } from "@/components/ui/data-table";
import { Contract } from "@prisma/client";
import { createColumns } from "./columns";

interface Props {
  contracts: Contract[];
  currentUser: SessionUser | null | undefined;
}

export default function ContractSettings({ contracts, currentUser }: Props) {
  const columns = createColumns(currentUser);

  return (
    <div className="flex flex-col gap-4">
      <DataTable columns={columns} data={contracts} isLoading={false} />
    </div>
  );
}
