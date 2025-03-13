"use client"

import { User, Subscription, Charge } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Tier from "@/app/models/Tier";
import { formatDate } from "@/lib/utils";
import SubscriptionStatusBadge from "./subscription-state";
import PurchaseStatusBadge from "./purchase-state";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type CustomerWithChargesAndSubscriptions = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
};

export type CustomerTableItem = {
  id: string;
  userId: string;
  userName: string | null;
  userCompany: string | null;
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
    cell: function UserNameCell({ row, table }) {
      // Check if this is the first row for this customer
      const currentUserId = row.original.userId;
      const rowIndex = table.getRowModel().rows.findIndex(r => r.id === row.id);
      
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
    accessorKey: "userCompany",
    header: "Company",
    cell: function CompanyCell({ row, table }) {
      // Check if this is the first row for this customer
      const currentUserId = row.original.userId;
      const rowIndex = table.getRowModel().rows.findIndex(r => r.id === row.id);
      
      // Hide company if this is not the first row for this customer
      if (rowIndex > 0) {
        const prevRow = table.getRowModel().rows[rowIndex - 1];
        if (prevRow.original.userId === currentUserId) {
          return null;
        }
      }
      
      return row.original.userCompany || "(unknown)";
    }
  },
  {
    accessorKey: "userEmail",
    header: "Email",
    cell: function EmailCell({ row, table }) {
      // Check if this is the first row for this customer
      const currentUserId = row.original.userId;
      const rowIndex = table.getRowModel().rows.findIndex(r => r.id === row.id);
      
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
    header: "Package",
  },
  {
    id: "status",
    header: "Status",
    cell: function StatusCell({ row }) {
      if (row.original.statusType === "subscription" && row.original.subscription) {
        return <SubscriptionStatusBadge subscription={row.original.subscription} />;
      } else if (row.original.charge) {
        return <PurchaseStatusBadge charge={row.original.charge} />;
      }
      return null;
    }
  },
  {
    accessorKey: "createdAt",
    header: function DateHeader() { 
      return <div className="text-right">Customer Since</div>;
    },
    cell: function DateCell({ row }) {
      return <div className="text-right">{formatDate(row.original.createdAt)}</div>;
    }
  },
  {
    id: "actions",
    cell: function ActionsCell({ row, table }) {
      // Check if this is the first row for this customer
      const currentUserId = row.original.userId;
      const rowIndex = table.getRowModel().rows.findIndex(r => r.id === row.id);
      
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