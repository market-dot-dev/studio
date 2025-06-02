"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import { inviteUsersToOrganization } from "@/app/services/team-management-service";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, UserRound, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function InviteTeamMembersBtn() {
  const [isOpen, setIsOpen] = useState(false);
  const [emailsInput, setEmailsInput] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleInvite = () => {
    const emails = emailsInput
      .split(/[,\s\n]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emails.length === 0) {
      setError("Please enter at least one email address.");
      return;
    }

    const invalidEmails = emails.filter((email) => !isValidEmail(email));

    if (invalidEmails.length > 0) {
      if (invalidEmails.length === 1) {
        setError(`Invalid email address: ${invalidEmails[0]}`);
      } else {
        setError(`Invalid email addresses: ${invalidEmails.join(", ")}`);
      }
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        const result = await inviteUsersToOrganization(emails, OrganizationRole.MEMBER);

        if (result.success.length > 0) {
          toast.success(`Successfully invited ${result.success.length} user(s)`);
        }

        if (result.errors.length > 0) {
          result.errors.forEach((error) => toast.error(error));
        }

        setEmailsInput("");
        setIsOpen(false);
        router.refresh(); // Refresh the page to show new invites
      } catch (error: any) {
        console.error("Error inviting users:", error);
        toast.error(error.message || "Failed to send invitations");
      }
    });
  };

  const handleInputChange = (value: string) => {
    setEmailsInput(value);
    if (error) setError("");
  };

  const handleClose = () => {
    setEmailsInput("");
    setError("");
    setIsOpen(false);
  };

  const isDisabled = emailsInput.trim().length === 0 || isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isPending}>
          <UserRoundPlus />
          Invite Teammates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Teammates</DialogTitle>
          <DialogDescription>
            Send invites to join your organization. Separate emails by spaces, commas, or new lines.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <div>
            <Label htmlFor="emails" className="mb-2">
              Email Addresses
            </Label>
            <div>
              <Textarea
                id="emails"
                value={emailsInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="john@example.com, jane@company.io, mike@startup.co"
                className="relative z-[1] w-full"
                rows={4}
              />
              <div className="z-0 flex gap-2 rounded-b-md border border-t-0 bg-stone-100 p-3 text-xs text-muted-foreground">
                <UserRound size={16} strokeWidth={2.25} />
                <p>
                  Everyone will be added as{" "}
                  <strong className="font-semibold text-foreground">Members</strong>. You can change
                  their roles later.
                </p>
              </div>
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleInvite} disabled={isDisabled} className="w-full">
            {isPending ? (
              <span>Sending...</span>
            ) : (
              <>
                <Send />
                Send Invites
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
