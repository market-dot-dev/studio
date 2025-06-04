"use client";

import { Charge, Subscription } from "@/app/generated/prisma";
import Tier from "@/app/models/Tier";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
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
    accessorKey: "userName",
    header: "Name",
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

      return row.original.userName;
    }
  },
  {
    accessorKey: "userEmail",
    header: "Email",
    cell: ({ row, table }) => {
      // Check if this is the first row for this customer
      const currentUserId = row.original.userId;
      const rowIndex = table.getRowModel().rows.findIndex((r) => r.id === row.id);

      // Hide email if this is not the first row for this customer
      if (rowIndex > 0) {
        const prevRow = table.getRowModel().rows[rowIndex - 1];
        if (prevRow.original.userId === currentUserId) {
          return null;
        }
      }

      return <Link href={`mailto:${row.original.userEmail}`}>{row.original.userEmail}</Link>;
    }
  },
  {
    accessorKey: "tierName",
    header: "Package"
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
    accessorKey: "createdAt",
    header: "Customer Since",
    cell: ({ row }) => {
      return <div>{formatDate(row.original.createdAt)}</div>;
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
          <Button variant="outline" size="sm" asChild>
            <Link href={`/customers/${row.original.userId}`}>View</Link>
          </Button>
        </div>
      );
    }
  }
];
