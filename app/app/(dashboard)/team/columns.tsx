"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

// Placeholder type - replace with actual type later
export type TeamMember = {
  id: string;
  name: string | null;
  email: string;
  status: "Admin" | "Collaborator";
  invitePending: boolean;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    openEditModal: (member: TeamMember) => void;
    removeOrUninvite: (member: TeamMember) => void;
  }
}

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string | null;
      const email = row.original.email;
      return name || <span className="italic text-stone-500">Invited ({email})</span>;
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string | null;
      return name ? <div>{row.getValue("email")}</div> : null;
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isPending = row.original.invitePending;
      return (
        <div className="flex items-center gap-2">
          <span>{status}</span>
          {isPending && <Badge variant="outline">Pending Invite</Badge>}
        </div>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const member = row.original;
      const isPending = member.invitePending;
      const openEditModal = table.options.meta?.openEditModal;
      const removeOrUninvite = table.options.meta?.removeOrUninvite;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => openEditModal?.(member)} disabled={!openEditModal}>
              Edit Status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-rose-500 hover:!bg-rose-500 hover:!text-white focus:!bg-rose-500 focus:!text-white"
              onClick={() => removeOrUninvite?.(member)}
              disabled={!removeOrUninvite}
            >
              {isPending ? "Uninvite" : "Remove from Team"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
