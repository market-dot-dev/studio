import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { ProspectWithTier, columns } from "./columns";
import { DataTable } from "./data-table";
import { Card } from "@/components/ui/card";

export const ProspectsTable: React.FC<{
  prospects: ProspectWithTier[];
  maxInitialRows?: number;
}> = ({ prospects, maxInitialRows }) => {
  const showAll = false;
  const visibleProspects = maxInitialRows && !showAll
    ? prospects.slice(0, maxInitialRows)
    : prospects;

  return (
    <>
      <DataTable columns={columns} data={visibleProspects} />
      
      {!showAll && maxInitialRows && prospects.length > maxInitialRows && (
        <div className="grid justify-items-end mt-4">
          <Link href="/prospects">
            <Button size="sm" variant="outline">
              View All Prospects →
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default ProspectsTable;
