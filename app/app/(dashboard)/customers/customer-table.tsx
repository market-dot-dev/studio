import { User, Subscription, Charge } from "@prisma/client";
import React from "react";
import Tier from "@/app/models/Tier";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./data-table";
import { CustomerTableItem, columns } from "./columns";

export type CustomerWithChargesAndSubscriptions = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
};

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
        subscription: sub,
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
        charge: charge,
      })),
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
            <Link href="/customers">
              View All Customers
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default CustomersTable;
