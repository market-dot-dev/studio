"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { MailMinus, MoreVertical, Pencil, UserRoundMinus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
      const email = row.getValue("email") as string;
      return (
        <div className="flex items-center gap-2 font-semibold text-stone-800">{name || email}</div>
      );
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div>{row.getValue("email")}</div>;
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <Badge variant="secondary">{row.getValue("status")}</Badge>;
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const member = row.original;
      const isPending = member.invitePending;
      const openEditModal = table.options.meta?.openEditModal;
      const removeOrUninvite = table.options.meta?.removeOrUninvite;
      const [showConfirmDialog, setShowConfirmDialog] = useState(false);

      const handleConfirmAction = () => {
        const memberName = member.name || member.email;
        const action = isPending ? "uninvited" : "removed";

        removeOrUninvite?.(member);
        setShowConfirmDialog(false);

        toast.success(`${memberName} was ${action}`);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditModal?.(member)} disabled={!openEditModal}>
                <Pencil />
                Change role
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowConfirmDialog(true)}
                disabled={!removeOrUninvite}
                destructive
              >
                {isPending ? (
                  <>
                    <MailMinus />
                    Uninvite
                  </>
                ) : (
                  <>
                    <UserRoundMinus />
                    Remove
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isPending
                    ? `Are you sure you want to uninvite ${member.email}?`
                    : `Are you sure you want to remove ${member.name || member.email}?`}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isPending
                    ? `This will cancel the invitation for ${member.email}.`
                    : `They'll be will removed from your team and won't be able to access your dashboard anymore.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Nevermind</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmAction} variant="destructive">
                  Yes, {isPending ? "Uninvite" : "Remove"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    }
  }
];
