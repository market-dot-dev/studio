"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface InviteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onInvite: (emails: string[]) => void; // Placeholder for actual invite logic
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function InviteModal({ isOpen, onOpenChange, onInvite }: InviteModalProps) {
  const [emailsInput, setEmailsInput] = useState("");
  const [error, setError] = useState("");

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
    onInvite(emails);
    setEmailsInput("");
    onOpenChange(false);
    toast.success("Invites sent");
  };

  const handleInputChange = (value: string) => {
    setEmailsInput(value);
    if (error) setError("");
  };

  const isDisabled = emailsInput.trim().length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Teammates</DialogTitle>
          <DialogDescription>
            Enter email addresses separated by spaces or commas. They'll get an email invite to join
            your organization.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 pb-2">
          <div>
            <Textarea
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
          <Button type="button" onClick={handleInvite} disabled={isDisabled} className="w-full">
            <Send />
            Send Invites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
