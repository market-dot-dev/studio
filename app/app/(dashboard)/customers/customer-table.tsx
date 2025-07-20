import { getCurrentVendorCustomers } from "@/app/services/organization/vendor-organization-service";
import { CustomersEmptyState } from "@/components/customer/empty-state";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import React from "react";
import { CustomerTableItem, columns } from "./columns";

type VendorCustomers = Awaited<ReturnType<typeof getCurrentVendorCustomers>>;

export const CustomersTable: React.FC<{
  customers: VendorCustomers;
  maxInitialRows?: number;
}> = ({ customers, maxInitialRows }) => {
  const showAll = false;

  // Transform CustomerProfile data for the table
  const tableData: CustomerTableItem[] = customers
    .flatMap((customerProfile) => [
      ...customerProfile.subscriptions.map((sub) => ({
        id: sub.id,
        userId: customerProfile.userId,
        userName: customerProfile.user.name,
        userEmail: customerProfile.user.email,
        tierName: sub.tier.name,
        statusType: "subscription" as const,
        createdAt: sub.createdAt,
        subscription: sub
      })),
      ...customerProfile.charges.map((charge) => ({
        id: charge.id,
        userId: customerProfile.userId,
        userName: customerProfile.user.name,
        userEmail: customerProfile.user.email,
        tierName: charge.tier.name,
        statusType: "charge" as const,
        createdAt: charge.createdAt,
        charge: charge
      }))
    ])
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const visibleData = showAll ? tableData : tableData.slice(0, maxInitialRows);

  if (tableData.length === 0) {
    return <CustomersEmptyState />;
  }

  return (
    <>
      <DataTable columns={columns} data={visibleData} />

      {!showAll && maxInitialRows && tableData.length > maxInitialRows && (
        <div className="grid justify-items-end">
          <Button variant="outline" asChild>
            <Link href="/customers">View All Customers</Link>
          </Button>
        </div>
      )}
    </>
  );
};
