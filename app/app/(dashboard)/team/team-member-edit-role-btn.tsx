"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import { changeTeamMemberRole } from "@/app/services/team-management-service";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TeamMemberDisplay } from "@/types/team";
import { Key, Pencil, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  member: TeamMemberDisplay;
  currentUserRole?: OrganizationRole | null;
}

export function TeamMemberEditRoleBtn({ member, currentUserRole }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<OrganizationRole>(member.role);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isPendingInvite = member.invitePending;
  const isOwner = member.role === OrganizationRole.OWNER;

  // Permission checks - only admins and owners can edit roles
  const canEdit =
    currentUserRole === OrganizationRole.OWNER || currentUserRole === OrganizationRole.ADMIN;

  // Can't edit pending invites, owner role directly, or without proper permissions
  if (isPendingInvite || isOwner || !canEdit) {
    return null;
  }

  const handleSave = () => {
    startTransition(async () => {
      try {
        await changeTeamMemberRole(member.id, selectedRole);

        const memberName = member.name || member.email;
        const roleNames = {
          [OrganizationRole.OWNER]: "Owner",
          [OrganizationRole.ADMIN]: "Admin",
          [OrganizationRole.MEMBER]: "Member"
        };

        toast.success(`${memberName} is now ${roleNames[selectedRole]}`);

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
      setSelectedRole(member.role); // Reset to current role when opening
    }
    setIsOpen(open);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <Pencil className="size-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change role</p>
          </TooltipContent>
          <DialogContent className="bg-stone-100 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change Role for {member.name || member.email}</DialogTitle>
              <DialogDescription>
                Select the role you want to assign to this team member.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="flex flex-col gap-2">
                {/* Admin Option */}
                <label className="flex size-full select-none rounded focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-swamp">
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
                      Can manage team members and organization settings, but not billing.
                    </p>
                  </div>
                </label>

                {/* Member Option */}
                <label className="flex size-full select-none rounded focus-within:outline-none focus-within:ring-2 focus-within:ring-inset focus-within:ring-swamp">
                  <div
                    className={cn(
                      "flex h-full w-full flex-col items-start justify-start gap-1.5 rounded bg-white p-4 pt-3.5 shadow-border-sm transition-[background-color,box-shadow] cursor-pointer hover:shadow-border [&:has(input:checked)]:ring-2 [&:has(input:checked)]:ring-swamp"
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <UserCheck className="mr-2.5 size-[18px] text-stone-500" />
                        <span className="text-left text-sm font-semibold text-stone-800">
                          Member
                        </span>
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
                      Can access the organization but cannot manage settings or team.
                    </p>
                  </div>
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={selectedRole === member.role || isPending}>
                {isPending ? <span>Updating...</span> : "Change Role"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Tooltip>
    </TooltipProvider>
  );
}
