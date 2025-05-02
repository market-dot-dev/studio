import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { CustomerWithChargesAndSubscriptions } from "@/types/dashboard";
import Link from "next/link";
import React from "react";
import { CustomerTableItem, columns } from "./columns";

export const CustomersTable: React.FC<{
  customers: CustomerWithChargesAndSubscriptions[];
  maxInitialRows?: number;
}> = ({ customers, maxInitialRows }) => {
  const showAll = false;

  // Transform data for the table
  const tableData: CustomerTableItem[] = customers.flatMap((customer) => {
    const allItems = [
      ...customer.subscriptions.map((sub) => ({
        id: sub.id,
        userId: customer.id,
        userName: customer.name,
        userCompany: customer.company,
        userEmail: customer.email,
        tierName: sub.tier.name,
        statusType: "subscription" as const,
        createdAt: sub.createdAt,
        subscription: sub
      })),
      ...customer.charges.map((charge) => ({
        id: charge.id,
        userId: customer.id,
        userName: customer.name,
        userCompany: customer.company,
        userEmail: customer.email,
        tierName: charge.tier.name,
        statusType: "charge" as const,
        createdAt: charge.createdAt,
        charge: charge
      }))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return allItems;
  });

  const visibleData = showAll ? tableData : tableData.slice(0, maxInitialRows);

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
