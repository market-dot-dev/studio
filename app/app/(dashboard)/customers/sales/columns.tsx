"use client";

import { Charge, Prospect, Subscription } from "@/app/generated/prisma";
import Tier from "@/app/models/Tier";
import { Badge } from "@/components/ui/badge";
import { ViewButton } from "@/components/ui/view-button";
import { capitalize, formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Package } from "lucide-react";
import Link from "next/link";
import { PurchaseStatusBadge } from "../purchase-status-badge";
import { SubscriptionStatusBadge } from "../subscription-state";

export type Sale = {
  id: string;
  type: "subscription" | "charge" | "prospect";
  // For customers (subscriptions/charges)
  userId?: string;
  userName?: string;
  userEmail?: string;
  // For prospects
  prospectName?: string;
  prospectEmail?: string;
  prospectCompany?: string;
  // Common fields
  tierName?: string;
  tierNames?: string[];
  createdAt: Date;
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
    id: "customer",
    header: "Customer",
    meta: {
      emphasized: true
    },
    cell: ({ row }) => {
      // For prospects, show the prospect's info
      if (row.original.type === "prospect") {
        const companyName = row.original.prospectCompany;
        const name = row.original.prospectName;

        return (
          <div className="flex flex-col">
            <span className="font-semibold text-stone-800">{companyName || name || "—"}</span>
            {name && companyName && (
              <span className="text-xs font-normal text-muted-foreground">{name}</span>
            )}
          </div>
        );
      }

      // For customers (subscriptions/charges), show user info
      const userName = row.original.userName;
      const userEmail = row.original.userEmail;

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-stone-800">{userName || "—"}</span>
          {userEmail && (
            <span className="text-xs font-normal text-muted-foreground">{userEmail}</span>
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
    cell: ({ row }) => {
      // For prospects, link to the prospect detail page
      if (row.original.type === "prospect" && row.original.prospect) {
        return <ViewButton href={`/prospects/${row.original.prospect.id}`} />;
      }

      // For customers (charges/subscriptions), link to the customer page using userId
      if (row.original.userId) {
        return <ViewButton href={`/customers/${row.original.userId}`} />;
      }

      return null;
    }
  }
];
