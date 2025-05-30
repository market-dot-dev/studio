"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import { cancelInvitation, removeTeamMember } from "@/app/services/team-management-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TeamMemberDisplay } from "@/types/team";
import { MailMinus, UserRoundMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  member: TeamMemberDisplay;
}

export function TeamMemberRemoveBtn({ member }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isPendingInvite = member.invitePending;
  const isOwner = member.role === OrganizationRole.OWNER;

  // Owners can't be removed
  if (isOwner) {
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
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          {isPendingInvite ? (
            <MailMinus className="size-4" />
          ) : (
            <UserRoundMinus className="size-4" />
          )}
        </Button>
      </AlertDialogTrigger>
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
  );
}
