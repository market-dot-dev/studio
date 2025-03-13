"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// This type is used to define the shape of our data.
export type Page = {
  id: string
  title: string
  slug: string
  draft: boolean
}

export const columns: ColumnDef<Page>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "slug",
    header: "Path",
    cell: ({ row, table }) => {
      // Access custom props from the table meta
      const meta = table.options.meta as { homepageId?: string; url?: string }
      const { url, homepageId } = meta || {}
      const page = row.original
      
      return (
        <a
          href={url + (page.id === homepageId ? "" : `/${page.slug}`)}
          target="_blank"
          rel="noreferrer"
          className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600"
        >
          {page.id === homepageId ? "" : `/${page.slug}`} ↗
        </a>
      )
    },
  },
  {
    accessorKey: "draft",
    header: "Status",
    cell: ({ row }) => {
      const draft = row.original.draft
      
      return draft ? (
        <Badge variant="secondary" size="sm">
          Draft
        </Badge>
      ) : (
        <Badge variant="success" size="sm">
          Live
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Link href={`/page/${row.original.id}`}>Edit</Link>,
  },
] 