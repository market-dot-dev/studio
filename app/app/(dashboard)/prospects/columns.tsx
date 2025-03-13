"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Prospect } from "@prisma/client"
import Tier from "@/app/models/Tier"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

// Define the shape of our data
export type ProspectWithTier = Prospect & { tier: Tier }

export const columns: ColumnDef<ProspectWithTier>[] = [
  {
    accessorKey: "createdAt",
    header: "Submitted On",
    cell: ({ row }) => {
      return formatDate(row.original.createdAt)
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <a href={`mailto:${row.original.email}`}>{row.original.email}</a>
    },
  },
  {
    accessorKey: "organization",
    header: "Organization",
  },
  {
    accessorKey: "tier",
    header: "Package",
    cell: ({ row }) => {
      return (
        <Link href={`/tiers/${row.original.tier.id}`} target="_blank">
          {row.original.tier.name}
        </Link>
      )
    },
  },
  {
    accessorKey: "context",
    header: "Details",
  },
] 