import { User, Subscription, Charge, Prospect } from "@prisma/client";
import React from "react";
import Tier from "@/app/models/Tier";
import Link from "next/link";
import { ChevronRight, Receipt, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Sale, columns } from "./columns";

export type CustomerWithChargesSubscriptionsAndProspects = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
  prospects: (Prospect & { tiers: Tier[] })[];
};

const SalesTable = ({
  customersAndProspects,
  maxInitialRows,
}: {
  customersAndProspects: CustomerWithChargesSubscriptionsAndProspects[];
  maxInitialRows?: number;
}) => {
  const showAll = false;

  // Transform data to sales array for use with our columns definition
  const sales: Sale[] = customersAndProspects.flatMap((customer, customerIndex) => [
    ...customer.subscriptions.map((subscription, index) => ({
      id: `subscription-${customer.id}-${index}`,
      type: "subscription" as const,
      user: customer,
      tierName: subscription.tier.name,
      createdAt: subscription.createdAt,
      userId: customer.id,
      subscription: subscription,
    })),
    ...customer.charges.map((charge, index) => ({
      id: `charge-${customer.id}-${index}`,
      type: "charge" as const,
      user: customer,
      tierName: charge.tier.name,
      createdAt: charge.createdAt,
      userId: customer.id,
      charge: charge,
    })),
    ...customer.prospects.map((prospect, index) => ({
      id: `prospect-${customer.id}-${index}`,
      type: "prospect" as const,
      user: prospect,
      tierNames: prospect.tiers.map((tier) => tier.name),
      createdAt: prospect.updatedAt,
      userId: customer.id,
    })),
  ]);

  // Sort by createdAt in descending order (latest first)
  sales.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const visibleSales = showAll ? sales : sales.slice(0, maxInitialRows);

  return (
    <>
      <div className="mb-4 flex w-full items-end justify-between">
        <h3 className="text-xl font-semibold">Sales & Prospects</h3>
        <Link href="/customers">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="group gap-0.5 pr-1"
              >
                View All
                <ChevronRight
                  size={10}
                  className="inline-block transition-transform group-hover:translate-x-px"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/customers" className="w-full">
                    Customers
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/prospects" className="w-full">
                    Prospects
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Link>
      </div>

      {sales.length === 0 ? (
        <Card className="mb-8 flex h-72 flex-col items-center justify-center border border-dashed border-stone-400/40 bg-stone-200/25 shadow-none">
          <div className="flex flex-col items-center justify-center py-6">
            <Receipt className="mb-3 h-9 w-9 text-swamp" strokeWidth={1.5} />
            <h3 className="mb-2 text-xl font-semibold">No sales... yet</h3>
            <p className="max-w-md text-center text-sm text-stone-500">
              When you make your first sale
              <br /> it&apos;ll show up here.
            </p>
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link href="/leads">
                  <ScanSearch />
                  Find customers
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="mb-8">
          <DataTable columns={columns} data={visibleSales} />
        </div>
      )}
    </>
  );
};

export default SalesTable; 