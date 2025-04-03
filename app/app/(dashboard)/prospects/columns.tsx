"use client"

import { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import Prospect from "@/app/models/Prospect"
import { Button } from "@/components/ui/button"
import { Eye, Package } from "lucide-react"
import { QualificationBadge } from "@/components/prospects/qualification-badge"

export const columns: ColumnDef<Prospect>[] = [
  {
    accessorKey: "createdAt",
    header: "Reached out",
    cell: ({ row }) => {
      return formatDate(row.original.createdAt)
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const status = row.original.qualificationStatus;

      return (
        <div className="flex w-fit flex-col">
          <div className="flex w-fit items-center gap-1.5">
            <Link
              href={`/prospects/${row.original.id}`}
              className="hover:underline"
            >
              {row.original.name}
            </Link>
            <QualificationBadge status={status} size="sm" />
          </div>
          <span className="text-xs font-normal text-stone-500">
            {row.original.email}
          </span>
        </div>
      );
    },
    meta: {
      emphasized: true
    }
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => {
      const company = row.original.company || "—";
      const jobTitle = row.original.jobTitle;
      
      return (
        <div className="flex flex-col">
          <span className="font-medium text-stone-800">{company}</span>
          <span className="text-xs font-normal text-stone-500">
            {jobTitle || "—"}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "interestedPackage",
    header: "Interested In",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1.5 font-medium text-stone-800">
          {row.original.interestedPackage || "—"}
        </div>
      );
    },
  },
  {
    
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
            <Link href={`/prospects/${row.original.id}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View prospect</span>
            </Link>
          </Button>
        </div>
      );
    },
  },
] 