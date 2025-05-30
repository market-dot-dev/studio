"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import { transferOwnership } from "@/app/services/team-management-service";
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
import { TeamMemberDisplay } from "@/types/team";
import { AlertTriangle, Crown, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  member: TeamMemberDisplay;
}

export function TeamMemberTransferOwnershipBtn({ member }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isPendingInvite = member.invitePending;
  const isOwner = member.role === OrganizationRole.OWNER;

  // Can only transfer to non-pending, non-owner members
  if (isPendingInvite || isOwner) {
    return null;
  }

  const handleTransfer = () => {
    startTransition(async () => {
      try {
        await transferOwnership(member.id);

        const memberName = member.name || member.email;
        toast.success(`Ownership transferred to ${memberName}`);

        setIsOpen(false);
        router.refresh(); // Refresh to update the table
      } catch (error: any) {
        console.error("Error transferring ownership:", error);
        toast.error(error.message || "Failed to transfer ownership");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <RefreshCw className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="size-5" />
            Transfer Ownership
          </DialogTitle>
          <DialogDescription>
            Transfer ownership of this organization to {member.name || member.email}. You will
            become an admin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <div className="text-sm text-amber-800">
                <p className="mb-1 font-medium">This action cannot be undone</p>
                <ul className="space-y-1 text-xs">
                  <li>• {member.name || member.email} will become the organization owner</li>
                  <li>• You will become an admin with reduced privileges</li>
                  <li>• Only the new owner can transfer ownership again</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleTransfer} disabled={isPending} variant="destructive">
            {isPending ? (
              <span>Transferring...</span>
            ) : (
              <>
                <Crown className="mr-2 size-4" />
                Transfer Ownership
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
