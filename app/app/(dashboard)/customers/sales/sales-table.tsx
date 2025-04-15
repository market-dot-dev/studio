import Tier from "@/app/models/Tier";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Charge, Prospect, Subscription, User } from "@prisma/client";
import { ChevronRight, Receipt, ScanSearch } from "lucide-react";
import Link from "next/link";
import { Sale, columns } from "./columns";

type CustomerWithChargesSubscriptionsAndProspects = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
  prospects: (Prospect & { tiers: Tier[] })[];
};

const SalesTable = ({
  customersAndProspects,
  maxInitialRows
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
      subscription: subscription
    })),
    ...customer.charges.map((charge, index) => ({
      id: `charge-${customer.id}-${index}`,
      type: "charge" as const,
      user: customer,
      tierName: charge.tier.name,
      createdAt: charge.createdAt,
      userId: customer.id,
      charge: charge
    })),
    ...customer.prospects.map((prospect, index) => ({
      id: `prospect-${customer.id}-${index}`,
      type: "prospect" as const,
      user: prospect,
      tierNames: prospect.tiers.map((tier) => tier.name),
      createdAt: prospect.updatedAt,
      userId: customer.id
    }))
  ]);

  // Sort by createdAt in descending order (latest first)
  sales.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const visibleSales = showAll ? sales : sales.slice(0, maxInitialRows);

  return (
    <div className="space-y-4">
      <div className="flex w-full items-end justify-between">
        <h3 className="text-xl font-bold tracking-tightish">Sales & Prospects</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="group gap-0.5 pr-1">
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
      </div>

      {sales.length === 0 ? (
        <Card className="mb-8 flex h-72 flex-col items-center justify-center border border-dashed border-stone-400/50 bg-stone-200/30 shadow-none">
          <div className="flex flex-col items-center justify-center py-6">
            <Receipt className="mb-3 size-9 text-swamp" strokeWidth={1.5} />
            <h3 className="mb-2 text-xl font-semibold">No sales... yet</h3>
            <p className="max-w-md text-center text-sm text-stone-500">
              When you make your first sale
              <br /> it&apos;ll show up here.
            </p>
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link href="/research">
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
    </div>
  );
};

export default SalesTable;
