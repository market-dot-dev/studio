"use client"

import { ColumnDef } from "@tanstack/react-table";
import { User, Prospect, Subscription, Charge } from "@prisma/client";
import Tier from "@/app/models/Tier";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import SubscriptionStatusBadge from "../subscription-state";
import PurchaseStatusBadge from "../purchase-state";
import { capitalize } from "@/lib/utils";

export type Sale = {
  id: string;
  type: "subscription" | "charge" | "prospect";
  user: User | Prospect;
  tierName?: string;
  tierNames?: string[];
  createdAt: Date;
  userId: string;
  subscription?: Subscription & { tier: Tier };
  charge?: Charge & { tier: Tier };
};

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "user.name",
    header: "Name",
    cell: ({ row }) => row.original.user.name
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => {
      return <a href={`mailto:${row.original.user.email}`}>{row.original.user.email}</a>;
    }
  },
  {
    id: "package",
    header: "Package",
    cell: ({ row }) => {
      if (row.original.tierNames && row.original.tierNames.length > 0) {
        return row.original.tierNames.join(", ");
      }
      return row.original.tierName;
    }
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return <Badge variant="secondary">{capitalize(row.original.type)}</Badge>;
    }
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      if (row.original.type === "subscription" && row.original.subscription) {
        return <SubscriptionStatusBadge subscription={row.original.subscription} />;
      } else if (row.original.type === "charge" && row.original.charge) {
        return <PurchaseStatusBadge charge={row.original.charge} />;
      }
      return "-";
    }
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return formatDate(row.original.createdAt);
    }
  }
]; 