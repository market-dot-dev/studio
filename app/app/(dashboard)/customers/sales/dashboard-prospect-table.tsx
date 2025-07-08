import { getProspectsOfVendor } from "@/app/services/organization/vendor-organization-service";
import { ProspectsEmptyState } from "@/components/prospects/empty-state";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Sale, columns } from "./columns";

type VendorProspects = Awaited<ReturnType<typeof getProspectsOfVendor>>;

const DashboardProspectTable = ({
  prospects,
  maxInitialRows
}: {
  prospects: VendorProspects;
  maxInitialRows?: number;
}) => {
  const showAll = false;

  // Transform prospect data to sales array
  const sales: Sale[] = prospects.map((prospect, index) => ({
    id: `prospect-${prospect.id}-${index}`,
    type: "prospect" as const,
    prospectName: prospect.name,
    prospectEmail: prospect.email,
    prospectCompany: prospect.companyName || undefined,
    tierNames: prospect.tiers.map((tier) => tier.name),
    createdAt: prospect.updatedAt,
    prospect: prospect
  }));

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
