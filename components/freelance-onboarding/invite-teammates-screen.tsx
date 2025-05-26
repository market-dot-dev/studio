"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface InvitedTeammate {
  email: string;
  status: "invited" | "accepted";
}

interface InviteTeammatesScreenProps {
  onBack: () => void;
  onFinish: (invited: InvitedTeammate[]) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getInitial(email: string) {
  return email.trim().charAt(0).toUpperCase();
}

export function InviteTeammatesScreen({ onBack, onFinish }: InviteTeammatesScreenProps) {
  const [emailsInput, setEmailsInput] = useState("");
  const [invitedTeammates, setInvitedTeammates] = useState<InvitedTeammate[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Parse and validate emails
  const parsedEmails = emailsInput
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e.length > 0)
    .map((email) => ({ email, isValid: EMAIL_REGEX.test(email) }));

  const hasInvalid = parsedEmails.some((e) => !e.isValid);
  const hasDuplicates = parsedEmails.some((e) =>
    invitedTeammates.some((t) => t.email.toLowerCase() === e.email.toLowerCase())
  );

  const handleSendInvites = () => {
    if (parsedEmails.length === 0) {
      setError("Please enter at least one email address.");
      return;
    }
    if (hasInvalid) {
      setError("One or more email addresses are invalid.");
      return;
    }
    if (hasDuplicates) {
      setError("Some emails have already been invited.");
      return;
    }
    setError(null);
    // Instantly add all valid, non-duplicate emails as invited
    setInvitedTeammates([
      ...invitedTeammates,
      ...parsedEmails.map((e) => ({ email: e.email, status: "invited" as const }))
    ]);
    setEmailsInput("");
  };

  const handleToggleAccepted = (email: string) => {
    setInvitedTeammates((prev) =>
      prev.map((t) =>
        t.email === email ? { ...t, status: t.status === "invited" ? "accepted" : "invited" } : t
      )
    );
  };

  const canFinish = invitedTeammates.length > 0;

  return (
    <div className="mx-auto max-w-lg space-y-8 duration-500 animate-in fade-in-0 slide-in-from-bottom-4">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Invite your teammates</h1>
        <p className="text-sm text-stone-600">
          Add comma-separated emails to invite your team. You can skip this step if you want to set
          up solo.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="emails">Teammate Emails</Label>
            <Textarea
              id="emails"
              placeholder="e.g. alice@example.com, bob@example.com"
              value={emailsInput}
              onChange={(e) => setEmailsInput(e.target.value)}
              rows={2}
              className={error ? "border-destructive" : ""}
            />
            {error && <div className="mt-1 text-sm text-destructive">{error}</div>}
            <Button
              type="button"
              className="mt-2"
              onClick={handleSendInvites}
              disabled={parsedEmails.length === 0}
            >
              Send Invites
            </Button>
          </div>
        </CardContent>
      </Card>
      {invitedTeammates.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-semibold tracking-tight">Invited Teammates</h3>
            <ul className="space-y-3">
              {invitedTeammates.map((t) => (
                <li key={t.email} className="flex items-center gap-4">
                  <div
                    className="flex size-8 select-none items-center justify-center rounded-sm bg-swamp text-base font-bold text-white"
                    style={{ backgroundColor: "#3B5F41" }} // fallback swamp color
                  >
                    {getInitial(t.email)}
                  </div>
                  <span className="flex-1 text-sm text-stone-900">{t.email}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleAccepted(t.email)}
                    className={
                      t.status === "accepted"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "text-stone-600"
                    }
                  >
                    {t.status === "accepted" ? "Accepted" : "Invited"}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        {canFinish ? (
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => onFinish(invitedTeammates)}
          >
            Finish Setup
          </Button>
        ) : (
          <Button
            type="button"
            className="w-full sm:w-auto"
            variant="secondary"
            onClick={() => onFinish([])}
          >
            Skip and Finish
          </Button>
        )}
      </div>
    </div>
  );
}
