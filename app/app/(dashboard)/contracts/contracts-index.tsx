"use client";

import useCurrentSession from "@/app/hooks/use-current-session";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { Contract } from "@prisma/client";
import { useState } from "react";
import { createColumns } from "./columns";

export default function ContractSettings({ contracts }: { contracts: Contract[] }) {
  const [error, setError] = useState<{ message: string } | null>(null);
  const { currentUser } = useCurrentSession();

  // Consider the data as loading until currentUser is available
  const isLoading = currentUser === undefined || currentUser === null;

  const columns = createColumns(currentUser);

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <DataTable
        columns={columns}
        data={contracts}
        currentUser={currentUser}
        isLoading={isLoading}
      />
    </div>
  );
}
