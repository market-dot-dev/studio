import { getCustomersOfVendor } from "@/app/services/organization/vendor-organization-service";
import { CustomersEmptyState } from "@/components/customer/empty-state";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { isActive } from "@/types/subscription";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Sale, columns } from "./columns";

type VendorCustomers = Awaited<ReturnType<typeof getCustomersOfVendor>>;

const DashboardCustomerTable = ({
  customers,
  maxInitialRows
}: {
  customers: VendorCustomers;
  maxInitialRows?: number;
}) => {
  const showAll = false;

  // Transform CustomerProfile data to sales array
  const sales: Sale[] = customers.flatMap((customerProfile) => [
    ...customerProfile.subscriptions
      .filter((sub) => isActive(sub))
      .map((subscription, index) => ({
        id: `subscription-${customerProfile.id}-${index}`,
        type: "subscription" as const,
        userId: customerProfile.userId,
        userName: customerProfile.user.name ?? undefined,
        userEmail: customerProfile.user.email ?? undefined,
        tierName: subscription.tier.name,
        createdAt: subscription.createdAt,
        subscription: subscription
      })),
    ...customerProfile.charges.map((charge, index) => ({
      id: `charge-${customerProfile.id}-${index}`,
      type: "charge" as const,
      userId: customerProfile.userId,
      userName: customerProfile.user.name ?? undefined,
      userEmail: customerProfile.user.email ?? undefined,
      tierName: charge.tier.name,
      createdAt: charge.createdAt,
      charge: charge
    }))
  ]);

  // Sort by createdAt in descending order (latest first)
  sales.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const visibleSales = showAll ? sales : sales.slice(0, maxInitialRows);

  return (
    <div className="space-y-4">
      <div className="flex w-full items-end justify-between">
        <h3 className="text-xl font-bold">Recent Customers</h3>
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
