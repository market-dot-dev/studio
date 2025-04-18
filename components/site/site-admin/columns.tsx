"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
export type Page = {
  id: string;
  title: string;
  slug: string;
  draft: boolean;
};

export const columns: ColumnDef<Page>[] = [
  {
    accessorKey: "title",
    header: "Title",
    meta: {
      emphasized: true
    }
  },
  {
    accessorKey: "slug",
    header: "Path",
    cell: ({ row, table }) => {
      // Access custom props from the table meta
      const meta = table.options.meta as { homepageId?: string; url?: string };
      const { url, homepageId } = meta || {};
      const page = row.original;

      return (
        <Button variant="secondary" size="sm" asChild>
          <Link href={url + (page.id === homepageId ? "" : `/${page.slug}`)}>
            {page.id === homepageId ? "" : `/${page.slug}`} ↗
          </Link>
        </Button>
      );
    }
  },
  {
    accessorKey: "draft",
    header: "Status",
    cell: ({ row }) => {
      const draft = row.original.draft;

      return draft ? (
        <Badge variant="secondary" size="sm">
          Draft
        </Badge>
      ) : (
        <Badge variant="success" size="sm">
          Live
        </Badge>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/page/${row.original.id}`}>
            <Pencil className="mr-0.5 size-3" />
            Edit
          </Link>
        </Button>
      </div>
    )
  }
];
