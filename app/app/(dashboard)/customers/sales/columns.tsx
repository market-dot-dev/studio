"use client";

import { Charge, Prospect, Subscription } from "@/app/generated/prisma";
import Tier from "@/app/models/Tier";
import { Badge } from "@/components/ui/badge";
import { capitalize, formatDate } from "@/lib/utils";
import type { CustomerOrgWithAll } from "@/types/organization-customer";
import { ColumnDef } from "@tanstack/react-table";
import { PurchaseStatusBadge } from "../purchase-status-badge";
import { SubscriptionStatusBadge } from "../subscription-state";

export type Sale = {
  id: string;
  type: "subscription" | "charge" | "prospect";
  organization: CustomerOrgWithAll;
  ownerName?: string;
  ownerEmail?: string;
  tierName?: string;
  tierNames?: string[];
  createdAt: Date;
  organizationId: string;
  subscription?: Subscription & { tier: Tier };
  charge?: Charge & { tier: Tier };
  prospect?: Prospect & { tiers: Tier[] };
};

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "ownerName",
    header: "Name",
    meta: {
      emphasized: true
    },
    cell: ({ row }) => row.original.ownerName || row.original.organization.owner.name
  },
  {
    accessorKey: "ownerEmail",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.ownerEmail || row.original.organization.owner.email;
      return email ? <a href={`mailto:${email}`}>{email}</a> : "-";
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
      }

      if (row.original.type === "charge" && row.original.charge) {
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
  },
  {
    accessorKey: "organization.name",
    header: "Organization",
    cell: ({ row }) => row.original.organization.name
  }
];
