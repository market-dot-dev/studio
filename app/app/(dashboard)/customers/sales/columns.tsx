"use client"

import { ColumnDef } from "@tanstack/react-table";
import { User, Prospect, Subscription, Charge } from "@prisma/client";
import Tier from "@/app/models/Tier";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import SubscriptionStatusBadge from "../subscription-state";
import PurchaseStatusBadge from "../purchase-state";

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
    cell: function NameCell({ row }) {
      return row.original.user.name;
    }
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: function EmailCell({ row }) {
      return <a href={`mailto:${row.original.user.email}`}>{row.original.user.email}</a>;
    }
  },
  {
    id: "package",
    header: "Package",
    cell: function PackageCell({ row }) {
      if (row.original.tierNames && row.original.tierNames.length > 0) {
        return row.original.tierNames.join(", ");
      }
      return row.original.tierName;
    }
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: function TypeCell({ row }) {
      return <Badge variant="secondary">{row.original.type}</Badge>;
    }
  },
  {
    id: "status",
    header: "Status",
    cell: function StatusCell({ row }) {
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
    cell: function DateCell({ row }) {
      return formatDate(row.original.createdAt);
    }
  }
]; 