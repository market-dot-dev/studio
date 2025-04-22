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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface InviteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onInvite: (emails: string[]) => void; // Placeholder for actual invite logic
}

export function InviteModal({ isOpen, onOpenChange, onInvite }: InviteModalProps) {
  const [emailsInput, setEmailsInput] = useState("");

  const handleInvite = () => {
    const emails = emailsInput
      .split(/[,\s\n]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emails.length > 0) {
      onInvite(emails);
      setEmailsInput("");
      onOpenChange(false); // Close modal after invite
    } else {
      // Optional: Show an error if no valid emails are entered
      alert("Please enter at least one valid email address.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
          <DialogDescription>
            Enter email addresses separated by commas, spaces, or new lines. They will receive an
            invitation to join your organization.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="emails" className="text-right">
              Emails
            </Label>
            <Input
              id="emails"
              value={emailsInput}
              onChange={(e) => setEmailsInput(e.target.value)}
              placeholder="email1@example.com, email2@example.com"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleInvite}>
            Send Invites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
