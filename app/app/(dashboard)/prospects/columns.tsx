"use client";

import Tier from "@/app/models/Tier";
import { formatDate } from "@/lib/utils";
import { Lead } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Package } from "lucide-react";
import Link from "next/link";

export type LeadWithTier = Lead & { tier: Tier };

export const columns: ColumnDef<LeadWithTier>[] = [
  {
    accessorKey: "name",
    header: "Name",
    meta: {
      emphasized: true
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return (
        <a
          href={`mailto:${row.original.email}`}
          className="transition-colors hover:text-foreground"
        >
          {row.original.email}
        </a>
      );
    }
  },
  {
    accessorKey: "organization",
    header: "Organization"
  },
  {
    accessorKey: "tier",
    header: "Interested In",
    cell: ({ row }) => {
      const tier = row.original.tier;
      if (!tier) {
        return <span>—</span>;
      }
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
  },
  {
    accessorKey: "createdAt",
    header: "Reached Out",
    cell: ({ row }) => {
      return formatDate(row.original.createdAt);
    }
  }
];

export const renderProspectContextSubRowComponent = (row: Row<LeadWithTier>) => {
  const { context } = row.original;
  if (!context) {
    return null;
  }
  return (
    <div className="ml-px px-5 pb-4">
      <p className="max-w-[calc(100vw-88px)] whitespace-pre-wrap border-l py-1 pl-2 text-xs font-medium italic tracking-tightish text-stone-500 sm:max-w-[calc(100vw-120px)] md:sm:max-w-[calc(100vw-120px-var(--navWidth))]">
        <span className="mr-0.5 font-serif">{"\u201C"}</span>
        {context}
        <span className="font-serif">{"\u201D"}</span>
      </p>
    </div>
  );
};
