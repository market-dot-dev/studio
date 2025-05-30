"use client";

import { TeamMember } from "@/app/app/(dashboard)/team/columns";
import { Badge } from "@/components/ui/badge";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, Crown, Key, Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface EditRoleModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (memberId: string, newStatus: "Owner" | "Admin" | "Collaborator") => void;
  currentUserIsOwner?: boolean; // Whether the current logged-in user is an owner
}

export function EditRoleModal({
  member,
  isOpen,
  onOpenChange,
  onSave,
  currentUserIsOwner = false
}: EditRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<"Owner" | "Admin" | "Collaborator">(
    member?.status || "Collaborator"
  );
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

  useEffect(() => {
    if (member) {
      setSelectedRole(member.status);
    }
    // Reset confirmation email and save attempt when modal opens/closes or member changes
    setConfirmationEmail("");
    setHasAttemptedSave(false);
  }, [member, isOpen]);

  if (!member) return null;

  const isOwner = member.status === "Owner";

  // Get the target user's email for confirmation
  const targetUserEmail = member.email;

  // Check if ownership transfer is being attempted
  const isTransferringOwnership = selectedRole === "Owner" && !isOwner && currentUserIsOwner;

  // Validate confirmation email against target user's email
  const isEmailConfirmed = confirmationEmail.toLowerCase() === targetUserEmail.toLowerCase();

  // Disable save if transferring ownership but email not confirmed
  const isSaveDisabled = isTransferringOwnership
    ? !isEmailConfirmed
    : selectedRole === member.status;

  const handleSave = () => {
    if (isTransferringOwnership && !isEmailConfirmed) {
      setHasAttemptedSave(true);
      return; // Don't save if email confirmation failed
    }
    onSave(member.id, selectedRole);
    onOpenChange(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationEmail(e.target.value);
    // Clear error when they start typing
    if (hasAttemptedSave) {
      setHasAttemptedSave(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-32px)] overflow-hidden bg-stone-100 p-0 sm:max-w-[425px]">
        <ScrollArea className="max-h-[calc(100vh-32px)]">
          <div className="flex flex-col gap-6 p-6">
            <DialogHeader>
              <DialogTitle>Change Role for {member.name || member.email}</DialogTitle>
              <DialogDescription>
                {isOwner
                  ? "This user is the organization owner. No one can remove the owner."
                  : currentUserIsOwner
                    ? "Select the role you want to assign to this team member. As an owner, you can transfer ownership to another user."
                    : "Select the role you want to assign to this team member."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5">
              <div className="flex flex-col gap-2">
                {!isOwner && currentUserIsOwner && !member.invitePending && (
                  <label className="flex size-full rounded focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500">
                    <div
                      className={cn(
                        "flex h-full w-full flex-col items-start justify-start gap-1.5 rounded bg-white p-4 pt-3.5 shadow-border-sm transition-[background-color,box-shadow] cursor-pointer hover:shadow-border [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-amber-500"
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <Crown className="mr-2.5 size-[18px] text-amber-600" />
                          <span className="text-left text-sm font-semibold text-stone-800">
                            Owner
                          </span>
                          {member.status === "Owner" && (
                            <Badge variant="outline" size="sm" className="ml-2">
                              Current
                            </Badge>
                          )}
                        </div>
                        <input
                          id="status-owner"
                          type="radio"
                          name="member-status"
                          value="Owner"
                          className="border-stone-400 shadow-sm checked:border-amber-500 checked:text-amber-500 focus:outline-none focus:ring-0"
                          checked={selectedRole === "Owner"}
                          onChange={(e) =>
                            setSelectedRole(e.target.value as "Owner" | "Admin" | "Collaborator")
                          }
                        />
                      </div>
                      <p className="text-pretty pr-8 text-left text-xs leading-4 text-stone-500">
                        Transfer ownership to this user. You will become an Admin.
                      </p>
                    </div>
                  </label>
                )}

                <label className="flex size-full rounded focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-swamp">
                  <div
                    className={cn(
                      "flex h-full w-full flex-col items-start justify-start gap-1.5 rounded bg-white p-4 pt-3.5 shadow-border-sm transition-[background-color,box-shadow] cursor-pointer hover:shadow-border [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-swamp"
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <Key className="mr-2.5 size-[18px] text-stone-500" />
                        <span className="text-left text-sm font-semibold text-stone-800">
                          Admin
                        </span>
                        {member.status === "Admin" && (
                          <Badge variant="outline" size="sm" className="ml-2">
                            Current
                          </Badge>
                        )}
                      </div>
                      <input
                        id="status-admin"
                        type="radio"
                        name="member-status"
                        value="Admin"
                        className="border-stone-400 shadow-sm checked:border-swamp checked:text-swamp focus:outline-none focus:ring-0"
                        checked={selectedRole === "Admin"}
                        onChange={(e) =>
                          setSelectedRole(e.target.value as "Owner" | "Admin" | "Collaborator")
                        }
                      />
                    </div>
                    <p className="text-pretty pr-8 text-left text-xs leading-4 text-stone-500">
                      Full access. Can manage billing and invite/manage teammates.{" "}
                      {isOwner
                        ? "Admins can do everything that the owner can do except remove the owner."
                        : ""}
                    </p>
                  </div>
                </label>

                <label className="flex size-full rounded focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-swamp">
                  <div
                    className={cn(
                      "flex h-full w-full flex-col items-start justify-start gap-1.5 rounded bg-white p-4 pt-3.5 shadow-border-sm transition-[background-color,box-shadow] cursor-pointer hover:shadow-border [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-swamp"
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <Lock className="mr-2.5 size-[18px] text-stone-500" />
                        <span className="text-left text-sm font-semibold text-stone-800">
                          Collaborator
                        </span>
                        {member.status === "Collaborator" && (
                          <Badge variant="outline" size="sm" className="ml-2">
                            Current
                          </Badge>
                        )}
                      </div>
                      <input
                        id="status-collaborator"
                        type="radio"
                        name="member-status"
                        value="Collaborator"
                        className="border-stone-400 shadow-sm checked:border-swamp checked:text-swamp focus:outline-none focus:ring-0"
                        checked={selectedRole === "Collaborator"}
                        onChange={(e) =>
                          setSelectedRole(e.target.value as "Owner" | "Admin" | "Collaborator")
                        }
                      />
                    </div>
                    <p className="text-pretty pr-8 text-left text-xs leading-4 text-stone-500">
                      Can manage services but cannot manage billing or teammates.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Ownership Transfer Confirmation */}
            {isTransferringOwnership && (
              <div className="border-t pt-5">
                <div>
                  <Label htmlFor="confirmation-email" className="mb-1">
                    Confirm ownership transfer
                  </Label>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Type the email address of {member.name || member.email} to confirm the ownership
                    transfer
                  </p>
                  <div className="relative">
                    <Input
                      id="confirmation-email"
                      type="email"
                      value={confirmationEmail}
                      onChange={handleEmailChange}
                      className="pr-10 placeholder:text-transparent"
                      placeholder={targetUserEmail}
                      autoFocus
                    />
                    {/* Persistent placeholder overlay */}
                    <div className="pointer-events-none absolute inset-0 flex translate-y-[0.5px] items-center px-3">
                      <span className="select-none text-base text-stone-400 md:text-sm">
                        {targetUserEmail.split("").map((char, index) => (
                          <span
                            key={index}
                            className={
                              index < confirmationEmail.length ? "opacity-0" : "opacity-100"
                            }
                            style={{ transition: "opacity 0.1s ease" }}
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                    </div>
                    {/* Check icon when email matches */}
                    {isEmailConfirmed && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Check className="size-4 text-swamp-500" />
                      </div>
                    )}
                  </div>
                  {hasAttemptedSave && !isEmailConfirmed && (
                    <p className="text-xs text-red-600">
                      Email must match exactly: {targetUserEmail}
                    </p>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              {!isOwner && (
                <Button type="button" onClick={handleSave} disabled={isSaveDisabled}>
                  {isTransferringOwnership ? "Transfer Ownership" : "Change Role"}
                </Button>
              )}
            </DialogFooter>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
