"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import {
  changeTeamMemberRole,
  transferOwnership
} from "@/app/services/organization/team-management-service";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TeamMemberDisplay } from "@/types/team";
import { Check, Crown, Key, Lock, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  member: TeamMemberDisplay;
  currentUserRole?: OrganizationRole | null;
}

export function TeamMemberEditRoleBtn({ member, currentUserRole }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<OrganizationRole>(member.role);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isPendingInvite = member.invitePending;
  const isOwner = member.role === OrganizationRole.OWNER;
  const currentUserIsOwner = currentUserRole === OrganizationRole.OWNER;

  const canEdit =
    currentUserRole === OrganizationRole.OWNER || currentUserRole === OrganizationRole.ADMIN;

  if (isPendingInvite || isOwner || !canEdit) {
    return null;
  }

  useEffect(() => {
    if (member) {
      setSelectedRole(member.role);
    }
    setConfirmationEmail("");
    setHasAttemptedSave(false);
  }, [member, isOpen]);

  const targetUserEmail = member.email;

  const isTransferringOwnership =
    selectedRole === OrganizationRole.OWNER && !isOwner && currentUserIsOwner;

  const isEmailConfirmed = confirmationEmail.toLowerCase() === targetUserEmail.toLowerCase();

  const isSaveDisabled = isTransferringOwnership ? !isEmailConfirmed : selectedRole === member.role;

  const handleSave = () => {
    if (isTransferringOwnership && !isEmailConfirmed) {
      setHasAttemptedSave(true);
      return;
    }

    startTransition(async () => {
      try {
        const memberName = member.name || member.email;

        if (isTransferringOwnership) {
          await transferOwnership(member.id);
          toast.success(`Ownership transferred to ${memberName}`);
        } else {
          await changeTeamMemberRole(member.id, selectedRole);

          const roleNames = {
            [OrganizationRole.OWNER]: "Owner",
            [OrganizationRole.ADMIN]: "Admin",
            [OrganizationRole.MEMBER]: "Member"
          };

          toast.success(`${memberName} is now ${roleNames[selectedRole]}`);
        }

        setIsOpen(false);
        router.refresh(); // Refresh to update the table
      } catch (error: any) {
        console.error("Error updating role:", error);
        toast.error(error.message || "Failed to update role");
      }
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSelectedRole(member.role);
    }
    setIsOpen(open);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationEmail(e.target.value);
    // Clear error when they start typing
    if (hasAttemptedSave) {
      setHasAttemptedSave(false);
    }
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        <Pencil className="size-4" />
        Change role
      </DropdownMenuItem>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[calc(100vh-32px)] overflow-hidden bg-stone-100 p-0 sm:max-w-[425px]">
          <ScrollArea className="max-h-[calc(100vh-32px)]">
            <div className="flex flex-col gap-6 p-6">
              <DialogHeader>
                <DialogTitle>Change Role for {member.name || member.email}</DialogTitle>
                <DialogDescription>
                  {currentUserIsOwner
                    ? "Select the role you want to assign to this team member. As an owner, you can transfer ownership to another user."
                    : "Select the role you want to assign to this team member."}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-5">
                <div className="flex flex-col gap-2">
                  {/* Owner Option - only show if current user is owner */}
                  {currentUserIsOwner && (
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
                            {member.role === OrganizationRole.OWNER && (
                              <Badge variant="outline" size="sm" className="ml-2">
                                Current
                              </Badge>
                            )}
                          </div>
                          <input
                            id="role-owner"
                            type="radio"
                            name="member-role"
                            value={OrganizationRole.OWNER}
                            className="border-stone-400 shadow-sm checked:border-amber-500 checked:text-amber-500 focus:outline-none focus:ring-0"
                            checked={selectedRole === OrganizationRole.OWNER}
                            onChange={(e) => setSelectedRole(e.target.value as OrganizationRole)}
                          />
                        </div>
                        <p className="text-pretty pr-8 text-left text-xs leading-4 text-stone-500">
                          Transfer ownership to this user. You will become an Admin.
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Admin Option */}
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
                          {member.role === OrganizationRole.ADMIN && (
                            <Badge variant="outline" size="sm" className="ml-2">
                              Current
                            </Badge>
                          )}
                        </div>
                        <input
                          id="role-admin"
                          type="radio"
                          name="member-role"
                          value={OrganizationRole.ADMIN}
                          className="border-stone-400 shadow-sm checked:border-swamp checked:text-swamp focus:outline-none focus:ring-0"
                          checked={selectedRole === OrganizationRole.ADMIN}
                          onChange={(e) => setSelectedRole(e.target.value as OrganizationRole)}
                        />
                      </div>
                      <p className="text-pretty pr-8 text-left text-xs leading-4 text-stone-500">
                        Full access. Can manage billing and invite/manage teammates.
                        {isOwner
                          ? " Admins can do everything that the owner can do except remove the owner."
                          : ""}
                      </p>
                    </div>
                  </label>

                  {/* Member Option */}
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
                            Member
                          </span>
                          {member.role === OrganizationRole.MEMBER && (
                            <Badge variant="outline" size="sm" className="ml-2">
                              Current
                            </Badge>
                          )}
                        </div>
                        <input
                          id="role-member"
                          type="radio"
                          name="member-role"
                          value={OrganizationRole.MEMBER}
                          className="border-stone-400 shadow-sm checked:border-swamp checked:text-swamp focus:outline-none focus:ring-0"
                          checked={selectedRole === OrganizationRole.MEMBER}
                          onChange={(e) => setSelectedRole(e.target.value as OrganizationRole)}
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
                  <div className="flex flex-col">
                    <Label htmlFor="confirmation-email" className="mb-3">
                      Confirm ownership transfer
                    </Label>
                    <ul className="mb-2 ml-0.5 list-inside list-disc space-y-1 text-xs text-muted-foreground">
                      <li>{member.name || member.email} will become the organization owner</li>
                      <li>You will become an admin with reduced privileges</li>
                      <li>Only the new owner can transfer ownership again</li>
                    </ul>
                    <p className="mb-4 text-xs text-muted-foreground">
                      To confirm the transfer, type their email:
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
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSave} disabled={isSaveDisabled || isPending}>
                  {isPending ? (
                    <span>Updating...</span>
                  ) : isTransferringOwnership ? (
                    "Transfer Ownership"
                  ) : (
                    "Change Role"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
