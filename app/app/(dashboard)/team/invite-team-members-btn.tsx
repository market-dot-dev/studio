"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import { inviteUsersToOrganization } from "@/app/services/team-management-service";
import {
  generateId,
  TeamMemberInviteFields,
  validateTeamMemberInvites,
  type TeamMemberInvite
} from "@/components/onboarding/team-member-invite-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function InviteTeamMembersBtn() {
  const [isOpen, setIsOpen] = useState(false);
  const [invites, setInvites] = useState<TeamMemberInvite[]>([
    { id: generateId(), email: "", role: OrganizationRole.MEMBER }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleInvite = () => {
    const validationErrors = validateTeamMemberInvites(invites);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const validInvites = invites.filter((invite) => invite.email.trim());

    if (validInvites.length === 0) {
      return;
    }

    startTransition(async () => {
      try {
        // Group invites by role to make separate API calls
        const memberEmails = validInvites
          .filter((invite) => invite.role === OrganizationRole.MEMBER)
          .map((invite) => invite.email);

        const adminEmails = validInvites
          .filter((invite) => invite.role === OrganizationRole.ADMIN)
          .map((invite) => invite.email);

        let totalSuccess = 0;
        const allErrors: string[] = [];

        // Send member invites
        if (memberEmails.length > 0) {
          const memberResult = await inviteUsersToOrganization(
            memberEmails,
            OrganizationRole.MEMBER
          );
          totalSuccess += memberResult.success.length;
          allErrors.push(...memberResult.errors);
        }

        // Send admin invites
        if (adminEmails.length > 0) {
          const adminResult = await inviteUsersToOrganization(adminEmails, OrganizationRole.ADMIN);
          totalSuccess += adminResult.success.length;
          allErrors.push(...adminResult.errors);
        }

        if (totalSuccess > 0) {
          toast.success(`Successfully invited ${totalSuccess} user(s)`);
        }

        if (allErrors.length > 0) {
          allErrors.forEach((error) => toast.error(error));
        }

        setInvites([{ id: generateId(), email: "", role: OrganizationRole.MEMBER }]);
        setErrors({});
        setIsOpen(false);
        router.refresh();
      } catch (error: any) {
        console.error("Error inviting users:", error);
        toast.error(error.message || "Failed to send invitations");
      }
    });
  };

  const validInviteCount = invites.filter((invite) => invite.email.trim()).length;
  const isDisabled = validInviteCount === 0 || isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isPending}>
          <UserRoundPlus />
          Invite Teammates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-32px)] max-w-[425px] overflow-hidden p-0 sm:max-w-[425px]">
        <ScrollArea className="max-h-[calc(100vh-32px)]">
          <div className="flex flex-col gap-4 p-6">
            <DialogHeader>
              <DialogTitle>Invite Teammates</DialogTitle>
              <DialogDescription>
                Add team members to your organization and assign their roles.
              </DialogDescription>
            </DialogHeader>

            <TeamMemberInviteFields
              invites={invites}
              errors={errors}
              onInvitesChange={setInvites}
              onErrorsChange={setErrors}
            />

            <DialogFooter className="pt-2">
              <Button
                onClick={handleInvite}
                disabled={isDisabled || isPending}
                loading={isPending}
                loadingText="Sending Invites"
                className="w-full"
              >
                <Send />
                Send Invites
              </Button>
            </DialogFooter>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
