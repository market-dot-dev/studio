"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import {
  getPendingInvites,
  inviteUsersToOrganization
} from "@/app/services/team-management-service";
import {
  generateId,
  TeamMemberInviteFields,
  validateTeamMemberInvites,
  type TeamMemberInvite
} from "@/components/onboarding/team-member-invite-fields";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface PendingInvite {
  id: string;
  email: string;
  role: OrganizationRole;
  createdAt: Date;
}

export default function TeamOnboardingPage() {
  const [invites, setInvites] = useState<TeamMemberInvite[]>([
    { id: generateId(), email: "", role: OrganizationRole.MEMBER }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [isLoadingPendingInvites, setIsLoadingPendingInvites] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Load pending invites on component mount
  useEffect(() => {
    const loadPendingInvites = async () => {
      try {
        setIsLoadingPendingInvites(true);
        const invites = await getPendingInvites();
        setPendingInvites(invites);
      } catch (error) {
        console.error("Error loading pending invites:", error);
      } finally {
        setIsLoadingPendingInvites(false);
      }
    };
    loadPendingInvites();
  }, []);

  const handleSubmit = () => {
    const validationErrors = validateTeamMemberInvites(invites);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const validInvites = invites.filter((invite) => invite.email.trim());

    if (validInvites.length === 0) {
      router.push("/onboarding/stripe");
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
          toast.success(`Successfully invited ${totalSuccess} team member(s)!`);

          // Clear the form and reload pending invites
          setInvites([{ id: generateId(), email: "", role: OrganizationRole.MEMBER }]);
          setErrors({});

          // Reload pending invites
          setIsLoadingPendingInvites(true);
          const updatedInvites = await getPendingInvites();
          setPendingInvites(updatedInvites);
          setIsLoadingPendingInvites(false);
        }

        if (allErrors.length > 0) {
          allErrors.forEach((error) => toast.error(error));
        }

        // Don't navigate away if there were invites sent - let user continue adding more or see pending invites
        if (totalSuccess === 0) {
          router.push("/onboarding/team");
        }
      } catch (error: any) {
        console.error("Error inviting team members:", error);
        toast.error(error.message || "Failed to send invitations");
      }
    });
  };

  const handleContinue = () => {
    router.push("/onboarding/stripe");
  };

  const handleSkip = () => {
    router.push("/onboarding/stripe");
  };

  // Check if any invite fields have content
  const hasFilledInvites = invites.some((invite) => invite.email.trim());
  const hasPendingInvites = pendingInvites.length > 0;

  return (
    <div className="mx-auto max-w-md">
      <div className="space-y-10">
        <div className="flex flex-col items-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Invite Your Team</h1>
          <p className="text-sm text-muted-foreground">
            Invite team members to collaborate on your organization
          </p>
        </div>

        <div className="space-y-8">
          <TeamMemberInviteFields
            invites={invites}
            errors={errors}
            onInvitesChange={setInvites}
            onErrorsChange={setErrors}
          />

          {hasPendingInvites && (
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Pending Invites</h3>
                <Separator />
              </div>
              <div className="space-y-3">
                {pendingInvites.map((invite) => (
                  <div key={invite.id} className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-white shadow-border-sm ">
                      <span className="text-sm font-bold ">
                        {invite.email.charAt(0).toUpperCase()}
                      </span>
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
        </div>

        <div className="space-y-3">
          {hasFilledInvites ? (
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isPending}
              loading={isPending}
              loadingText="Sending Invites"
            >
              <Send />
              Send Invites
            </Button>
          ) : (
            hasPendingInvites && (
              <Button onClick={handleContinue} className="w-full" disabled={isPending}>
                Continue
              </Button>
            )
          )}

          <Button
            onClick={handleSkip}
            variant={hasPendingInvites ? "ghost" : "secondary"}
            className={cn("w-full", hasPendingInvites && "text-muted-foreground")}
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}
