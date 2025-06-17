import { ProspectsEmptyState } from "@/components/prospects/empty-state";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { CustomerOrgWithAll } from "@/types/organization-customer";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Sale, columns } from "./columns";

const DashboardProspectTable = ({
  prospects,
  maxInitialRows
}: {
  prospects: CustomerOrgWithAll[];
  maxInitialRows?: number;
}) => {
  const showAll = false;

  const sales: Sale[] = prospects.flatMap((organization) => [
    ...organization.prospects.map((prospect, index) => ({
      id: `prospect-${organization.id}-${index}`,
      type: "prospect" as const,
      organization: organization,
      ownerName: prospect.name || "",
      ownerEmail: prospect.email || "",
      tierNames: prospect.tiers.map((tier) => tier.name),
      createdAt: prospect.updatedAt,
      organizationId: organization.id,
      prospect: prospect
    }))
  ]);

  sales.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const visibleSales = showAll ? sales : sales.slice(0, maxInitialRows);

  return (
    <div className="space-y-4">
      <div className="flex w-full items-end justify-between">
        <h3 className="text-xl font-bold">Prospects</h3>
        <Button variant="outline" size="sm" className="group gap-0.5 pr-1" asChild>
          <Link href="/prospects">
            View All
            <ChevronRight
              size={8}
              strokeWidth={1.5}
              className="inline-block transition-transform group-hover:translate-x-px"
            />
          </Link>
        </Button>
      </div>

      {sales.length === 0 ? (
        <ProspectsEmptyState />
      ) : (
        <div className="mb-8">
          <DataTable columns={columns} data={visibleSales} />
        </div>
      )}
    </div>
  );
};

export default DashboardProspectTable;
