import { User, Subscription, Charge, Prospect } from "@prisma/client";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import React from "react";
import Tier from "@/app/models/Tier";
import LinkButton from "@/components/common/link-button";
import DashboardCard from "@/components/common/dashboard-card";
import { capitalize, formatDate } from "@/lib/utils";
import Link from "next/link";
import { InfoIcon } from "lucide-react";
import SecondaryButton from "@/components/common/secondary-button";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/common/dropdown";

export type CustomerWithChargesSubscriptionsAndProspects = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
  prospects: (Prospect & { tiers: Tier[] })[];
};

type Sale = {
  type: "subscription" | "charge" | "prospect";
  user: User | Prospect;
  tierName?: string;
  tierNames?: string[];
  createdAt: Date;
  userId: string;
};

const SalesRow = ({ user, tierName, tierNames, createdAt, type }: Sale) => {
  return (
    <TableRow className="m-0 p-2">
      <TableCell className="m-0 p-2">{user.name}</TableCell>
      <TableCell className="m-0 p-2 text-left">
        <a href={`mailto:${user.email}`}>{user.email}</a>
      </TableCell>
      {tierNames && tierNames.length > 0 ? (
        <TableCell className="m-0 p-2 text-left">
          {tierNames.join(", ")}
        </TableCell>
      ) : (
        <TableCell className="m-0 p-2 text-left">{tierName}</TableCell>
      )}
      <TableCell className="m-0 p-2 text-right">
        <div className="flex flex-row justify-end gap-1">
          <Badge color="gray">{type}</Badge>
        </div>
      </TableCell>
      <TableCell className="m-0 p-2 text-right">
        {formatDate(createdAt)}
      </TableCell>
    </TableRow>
  );
};

const SalesTable = ({
  customersAndProspects,
  maxInitialRows,
}: {
  customersAndProspects: CustomerWithChargesSubscriptionsAndProspects[];
  maxInitialRows?: number;
}) => {
  const showAll = false;

  const sales: Sale[] = customersAndProspects.flatMap((customer) => [
    ...customer.subscriptions.map((subscription) => ({
      type: "subscription" as const,
      user: customer,
      tierName: subscription.tier.name,
      createdAt: subscription.createdAt,
      userId: customer.id,
    })),
    ...customer.charges.map((charge) => ({
      type: "charge" as const,
      user: customer,
      tierName: charge.tier.name,
      createdAt: charge.createdAt,
      userId: customer.id,
    })),
    ...customer.prospects.map((prospect) => ({
      type: "prospect" as const,
      user: prospect,
      tierNames: prospect.tiers.map((tier) => tier.name),
      createdAt: prospect.updatedAt,
      userId: customer.id,
    })),
  ]);

  // Sort by createdAt in descending order (latest first)
  sales.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const visiblePurchases = showAll ? sales : sales.slice(0, maxInitialRows);

  return (
    <>
      <div className="mb-2 flex w-full items-end justify-between">
        <h3 className="text-xl font-bold">Latest Sales and Prospects</h3>
        <Link href="/customers">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SecondaryButton label="View All" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/customers">Customers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/prospects">Prospects</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Link>
      </div>

      <DashboardCard className="mb-8">
        {sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <InfoIcon className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No sales data available
            </h3>
            <p className="max-w-md text-center text-gray-500">
              When you make your first sale, it will appear here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell className="p-2 text-left">
                  Name
                </TableHeaderCell>
                <TableHeaderCell className="p-2 text-left">
                  Email
                </TableHeaderCell>
                <TableHeaderCell className="p-2 text-left">
                  Package
                </TableHeaderCell>
                <TableHeaderCell className="text-right">Type</TableHeaderCell>
                <TableHeaderCell className="text-right">Date</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visiblePurchases.map((purchase, index) => (
                <SalesRow
                  key={`${purchase.type}-${index}`}
                  type={
                    capitalize(purchase.type) as
                      | "subscription"
                      | "charge"
                      | "prospect"
                  }
                  user={purchase.user}
                  tierName={purchase.tierName}
                  tierNames={purchase.tierNames}
                  createdAt={purchase.createdAt}
                  userId={purchase.userId}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </DashboardCard>
    </>
  );
};

export default SalesTable;
