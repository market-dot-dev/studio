"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import { inviteTeamMembers } from "@/app/services/organization/team-management-service";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateId } from "@/lib/utils";
import { TeamMemberDisplay } from "@/types/team";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { TeamMemberInviteFields, type TeamMemberInvite } from "./team-member-invite-fields";

const sanitizedInvites = (invites: TeamMemberInvite[]) => {
  return invites.filter((invite) => invite.email.trim() !== "");
};

export function TeamMemberInviteFormClient({
  initialInvites
}: {
  initialInvites: TeamMemberDisplay[];
}) {
  const [invites, setInvites] = useState<TeamMemberInvite[]>([
    { id: generateId(), email: "", role: OrganizationRole.MEMBER }
  ]);
  const [pendingInvites, setPendingInvites] = useState<TeamMemberDisplay[]>(initialInvites);
  const [errors, setErrors] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isDisabled = sanitizedInvites(invites).length === 0 || isPending;

  const handleInvitesChange = (newInvites: TeamMemberInvite[]) => {
    setInvites(newInvites);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validInvites = sanitizedInvites(invites);

    if (validInvites.length === 0) {
      return;
    }

    setErrors([]);
    startTransition(async () => {
      try {
        const result = await inviteTeamMembers(validInvites);

        if (result.errors.length > 0) {
          setErrors(result.errors);
        }

        if (result.success.length > 0) {
          toast.success(`Invited ${result.success.join(", ")}`);

          // Remove successful invite fields
          const erroredInvites = invites.filter(
            (invite) => !result.newInvites.some((newInvite) => newInvite.email === invite.email)
          );
          setInvites(
            erroredInvites.length > 0
              ? erroredInvites
              : [{ id: generateId(), email: "", role: OrganizationRole.MEMBER }]
          );

          // Add new invites to the pending invites list
          const newPendingInvites: TeamMemberDisplay[] = result.newInvites.map((invite) => ({
            id: invite.id,
            email: invite.email,
            role: invite.role,
            name: null,
            invitePending: true,
            createdAt: invite.createdAt
          }));
          setPendingInvites((prev) => [...newPendingInvites, ...prev]);
          router.refresh();
        }
      } catch (error) {
        console.error(error);
        const errorMessage = "An unexpected error occurred. Please try again.";
        setErrors([errorMessage]);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-6 transition-[height]">
      <TeamMemberInviteFields invites={invites} onInvitesChange={handleInvitesChange} />

      {errors.length > 0 && (
        <div className="text-xs text-destructive">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      {pendingInvites.length > 0 && (
        <div className="space-y-3 py-1">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Pending Invites</h3>
            <Separator />
          </div>
          <div className="space-y-2">
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-white shadow-border-sm">
                  <span className="text-sm font-bold ">{invite.email.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{invite.email}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {invite.role.toLowerCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sticky inset-x-0 bottom-6 bg-stone-150 pt-1">
        <Button
          type="submit"
          variant={isDisabled ? "secondary" : "default"}
          disabled={isDisabled}
          loading={isPending}
          loadingText="Sending Invites"
          className="w-full"
        >
          <Send />
          Send Invites
        </Button>
      </div>
    </form>
  );
}
