import { CustomersEmptyState } from "@/components/customer/empty-state";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { CustomerOrgWithChargesAndSubs } from "@/types/organization-customer";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Sale, columns } from "./columns";

const DashboardCustomerTable = ({
  customers,
  maxInitialRows
}: {
  customers: CustomerOrgWithChargesAndSubs[];
  maxInitialRows?: number;
}) => {
  const showAll = false;

  // Transform data to sales array for use with our columns definition
  const sales: Sale[] = customers.flatMap((organization) => [
    ...organization.subscriptions.map((subscription, index) => ({
      id: `subscription-${organization.id}-${index}`,
      type: "subscription" as const,
      organization: { ...organization, prospects: [] } as any,
      ownerName: organization.owner.name || "",
      ownerEmail: organization.owner.email || "",
      tierName: subscription.tier.name,
      createdAt: subscription.createdAt,
      organizationId: organization.id,
      subscription: subscription
    })),
    ...organization.charges.map((charge, index) => ({
      id: `charge-${organization.id}-${index}`,
      type: "charge" as const,
      organization: { ...organization, prospects: [] } as any,
      ownerName: organization.owner.name || "",
      ownerEmail: organization.owner.email || "",
      tierName: charge.tier.name,
      createdAt: charge.createdAt,
      organizationId: organization.id,
      charge: charge
    }))
  ]);

  // Sort by createdAt in descending order (latest first)
  sales.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const visibleSales = showAll ? sales : sales.slice(0, maxInitialRows);

  return (
    <div className="space-y-4">
      <div className="flex w-full items-end justify-between">
        <h3 className="text-xl font-bold">Customers</h3>
        <Button variant="outline" size="sm" className="group gap-0.5 pr-1" asChild>
          <Link href="/customers">
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
        <CustomersEmptyState />
      ) : (
        <div className="mb-8">
          <DataTable columns={columns} data={visibleSales} />
        </div>
      )}
    </div>
  );
};

export default DashboardCustomerTable;
