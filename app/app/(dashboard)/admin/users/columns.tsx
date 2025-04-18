"use client";

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <div className="font-mono text-xs">{id.substring(0, 8)}...</div>;
    }
  },
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "createdAt",
    header: "Join Date",
    cell: ({ row }) => {
      try {
        const rawDate = row.getValue("createdAt");

        // Display raw date format for debugging
        const rawStr = rawDate ? String(rawDate) : "N/A";

        if (!rawDate) return <div>N/A</div>;

        // Try to format the date
        try {
          const date = new Date(rawDate as Date | string);
          if (isNaN(date.getTime())) {
            return <div className="text-red-500">Invalid date: {rawStr.substring(0, 30)}</div>;
          }

          return (
            <div>
              <div>{format(date, "MMM d, yyyy")}</div>
              <div className="text-xs text-gray-500">{format(date, "h:mm a")}</div>
            </div>
          );
        } catch (e) {
          return <div className="text-red-500">Error: {rawStr.substring(0, 30)}</div>;
        }
      } catch (error) {
        console.error("Error processing date:", error);
        return <div className="text-red-500">Processing Error</div>;
      }
    },
    sortingFn: "datetime",
    sortDescFirst: true
  },
  {
    accessorKey: "gh_username",
    header: "GitHub Username",
    cell: ({ row }) => {
      const username = row.getValue("gh_username") as string | undefined;
      return <div>{username || "N/A"}</div>;
    }
  },
  {
    accessorKey: "roleId",
    header: "Role"
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const userId = row.original.id;
      return (
        <Button asChild variant="ghost" size="sm" className="flex items-center gap-1">
          <Link href={`/admin/users/${userId}`}>
            View Details
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      );
    }
  }
];
