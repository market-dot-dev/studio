"use client";

import { buttonVariants } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

// Type definition for debug links
export type DebugLink = {
  name: string;
  href: string;
};

export const columns: ColumnDef<DebugLink>[] = [
  {
    accessorKey: "name",
    header: "Debug Tool"
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const link = row.original;

      return (
        <Link href={link.href} className={buttonVariants({ variant: "outline", size: "sm" })}>
          View
        </Link>
      );
    }
  }
];
