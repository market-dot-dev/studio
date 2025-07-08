"use client";

import { Charge, Subscription } from "@/app/generated/prisma";
import Tier from "@/app/models/Tier";
import { ViewButton } from "@/components/ui/view-button";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Package } from "lucide-react";
import Link from "next/link";
import { PurchaseStatusBadge } from "./purchase-status-badge";
import { SubscriptionStatusBadge } from "./subscription-state";

export type CustomerTableItem = {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  tierName: string;
  statusType: "subscription" | "charge";
  createdAt: Date;
  subscription?: Subscription & { tier: Tier };
  charge?: Charge & { tier: Tier };
};

export const columns: ColumnDef<CustomerTableItem>[] = [
  {
    accessorKey: "createdAt",
    header: "Customer Since",
    cell: ({ row }) => {
      return <div>{formatDate(row.original.createdAt)}</div>;
    }
  },
  {
    accessorKey: "userName",
    header: "Customer",
    meta: {
      emphasized: true
    },
    cell: ({ row, table }) => {
      // Check if this is the first row for this customer
      const currentUserId = row.original.userId;
      const rowIndex = table.getRowModel().rows.findIndex((r) => r.id === row.id);

      // Hide name if this is not the first row for this customer
      if (rowIndex > 0) {
        const prevRow = table.getRowModel().rows[rowIndex - 1];
        if (prevRow.original.userId === currentUserId) {
          return null;
        }
      }

      const name = row.original.userName;
      const email = row.original.userEmail;

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-stone-800">{name}</span>
          {email && <span className="text-xs font-normal text-muted-foreground">{email}</span>}
        </div>
      );
    }
  },
  {
    accessorKey: "tierName",
    header: "Package",
    cell: ({ row }) => {
      // Get the tier from the subscription or charge
      let tier: Tier | undefined;
      if (row.original.subscription) {
        tier = row.original.subscription.tier;
      } else if (row.original.charge) {
        tier = row.original.charge.tier;
      }

      if (tier) {
        return (
          <Link
            href={`/tiers/${tier.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-foreground"
          >
            <Package size={14} />
            {tier.name}
          </Link>
        );
      }

      return row.original.tierName || "-";
    }
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      if (row.original.statusType === "subscription" && row.original.subscription) {
        return <SubscriptionStatusBadge subscription={row.original.subscription} />;
      }

      if (row.original.charge) {
        return <PurchaseStatusBadge charge={row.original.charge} />;
      }

      return null;
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      // Check if this is the first row for this customer
      const currentUserId = row.original.userId;
      const rowIndex = table.getRowModel().rows.findIndex((r) => r.id === row.id);

      // Hide actions if this is not the first row for this customer
      if (rowIndex > 0) {
        const prevRow = table.getRowModel().rows[rowIndex - 1];
        if (prevRow.original.userId === currentUserId) {
          return null;
        }
      }

      return (
        <div className="flex flex-row justify-end gap-1">
          <ViewButton href={`/customers/${row.original.userId}`} />
        </div>
      );
    }
  }
];
