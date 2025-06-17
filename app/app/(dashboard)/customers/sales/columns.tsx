"use client";

import { Charge, Prospect, Subscription } from "@/app/generated/prisma";
import Tier from "@/app/models/Tier";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { capitalize, formatDate } from "@/lib/utils";
import type { CustomerOrgWithAll } from "@/types/organization-customer";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";
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
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return formatDate(row.original.createdAt);
    }
  },
  {
    accessorKey: "organization.name",
    header: "Organization",
    meta: {
      emphasized: true
    },
    cell: ({ row }) => {
      const orgName = row.original.organization.name;
      const ownerName = row.original.ownerName || row.original.organization.owner.name;

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-stone-800">{orgName}</span>
          {ownerName && (
            <span className="text-xs font-normal text-muted-foreground">{ownerName}</span>
          )}
        </div>
      );
    }
  },
  {
    id: "package",
    header: "Package",
    cell: ({ row }) => {
      if (row.original.tierNames && row.original.tierNames.length > 0) {
        // For prospects with multiple tiers, show all of them in a vertical column
        if (row.original.prospect && row.original.prospect.tiers.length > 0) {
          return (
            <div className="flex flex-col">
              {row.original.prospect.tiers.map((tier) => (
                <Link
                  key={tier.id}
                  href={`/tiers/${tier.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-foreground"
                >
                  <Package size={14} />
                  {tier.name}
                </Link>
              ))}
            </div>
          );
        }
        return row.original.tierNames.join(", ");
      }

      // For subscriptions and charges, get the tier from the relationship
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
    id: "actions",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" asChild>
        <Link href={`/customers/${row.original.organizationId}`}>
          View
          <ChevronRight size={14} />
        </Link>
      </Button>
    )
  }
];
