"use client";

import { setCurrentOrganization } from "@/app/services/auth-service";
import { acceptInvitation } from "@/app/services/team-management-service";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface Props {
  inviteId: string;
  userId: string;
  organizationId: string;
}

export function AcceptInviteBtn({ inviteId, userId, organizationId }: Props) {
  const { update } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAcceptInvitation = () => {
    startTransition(async () => {
      try {
        // Accept the invitation
        await acceptInvitation(inviteId, userId);

        // Switch to the new organization
        await setCurrentOrganization(organizationId);

        // Trigger session update to refresh JWT with new organization context
        await update();

        toast.success("Invitation accepted! Welcome to the team.");

        // Navigate to dashboard in the new organization context
        router.push("/");
      } catch (error) {
        console.error("Error accepting invitation:", error);
        toast.error("Failed to accept invitation. You may already be a member.");
      }
    });
  };

  return (
    <Button onClick={handleAcceptInvitation} disabled={isPending} className="w-full">
      {isPending ? "Accepting..." : "Accept Invitation"}
    </Button>
  );
}
