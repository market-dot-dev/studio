"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import {
  cancelInvitation,
  removeTeamMember
} from "@/app/services/organization/team-management-service";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TeamMemberDisplay } from "@/types/team";
import { MailMinus, UserRoundMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  member: TeamMemberDisplay;
  currentUserRole?: OrganizationRole | null;
}

export function TeamMemberRemoveBtn({ member, currentUserRole }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isPendingInvite = member.invitePending;
  const isOwner = member.role === OrganizationRole.OWNER;

  // Permission checks - only admins and owners can remove members
  const canRemove =
    currentUserRole === OrganizationRole.OWNER || currentUserRole === OrganizationRole.ADMIN;

  // Owners can't be removed and user must have admin/owner permissions
  if (isOwner || !canRemove) {
    return null;
  }

  const handleConfirmAction = () => {
    startTransition(async () => {
      try {
        if (isPendingInvite) {
          await cancelInvitation(member.id);
        } else {
          await removeTeamMember(member.id);
        }

        const memberName = member.name || member.email;
        const action = isPendingInvite ? "uninvited" : "removed";
        toast.success(`${memberName} was ${action}`);

        setIsOpen(false);
        router.refresh(); // Refresh to update the table
      } catch (error: any) {
        console.error("Error removing member:", error);
        toast.error(error.message || "Failed to remove team member");
      }
    });
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        destructive
      >
        {isPendingInvite ? (
          <>
            <MailMinus className="size-4" />
            Cancel invitation
          </>
        ) : (
          <>
            <UserRoundMinus className="size-4" />
            Remove member
          </>
        )}
      </DropdownMenuItem>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isPendingInvite
                ? `Cancel invitation for ${member.email}?`
                : `Remove ${member.name || member.email}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isPendingInvite
                ? `This will cancel the pending invitation for ${member.email}.`
                : `${member.name || member.email} will be removed from your organization and won't be able to access your dashboard anymore.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? (
                <span>{isPendingInvite ? "Canceling..." : "Removing..."}</span>
              ) : (
                <>
                  {isPendingInvite ? (
                    <MailMinus className="size-4" />
                  ) : (
                    <UserRoundMinus className="size-4" />
                  )}
                  {isPendingInvite ? "Cancel Invitation" : "Remove Member"}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
