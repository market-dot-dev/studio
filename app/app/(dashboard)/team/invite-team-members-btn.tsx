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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Send, UserRoundPlus } from "lucide-react";
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
  const [selectedRole, setSelectedRole] = useState<OrganizationRole>(OrganizationRole.MEMBER);
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
        const result = await inviteUsersToOrganization(emails, selectedRole);

        if (result.success.length > 0) {
          toast.success(`Successfully invited ${result.success.length} user(s)`);
        }

        if (result.errors.length > 0) {
          result.errors.forEach((error) => toast.error(error));
        }

        setEmailsInput("");
        setSelectedRole(OrganizationRole.MEMBER);
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
    setSelectedRole(OrganizationRole.MEMBER);
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
            Enter email addresses separated by spaces, commas, or new lines. They'll get an email
            invite to join your organization.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 pb-2">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as OrganizationRole)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OrganizationRole.MEMBER}>Member</SelectItem>
                <SelectItem value={OrganizationRole.ADMIN}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="emails">Email Addresses</Label>
            <Textarea
              id="emails"
              value={emailsInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="john@example.com, jane@company.io, mike@startup.co"
              className="w-full"
              rows={4}
            />
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
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
