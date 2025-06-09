"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CircleMinus, CirclePlus } from "lucide-react";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate a simple unique ID for field keys
const generateId = (): string => {
  return `invite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export interface TeamMemberInvite {
  id: string;
  email: string;
  role: OrganizationRole;
}

interface TeamMemberInviteFieldsProps {
  invites: TeamMemberInvite[];
  errors: Record<string, string>;
  onInvitesChange: (invites: TeamMemberInvite[]) => void;
  onErrorsChange: (
    errors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)
  ) => void;
  showLabel?: boolean;
  className?: string;
}

export function TeamMemberInviteFields({
  invites,
  errors,
  onInvitesChange,
  onErrorsChange,
  showLabel = false,
  className
}: TeamMemberInviteFieldsProps) {
  const addInvite = () => {
    onInvitesChange([...invites, { id: generateId(), email: "", role: OrganizationRole.MEMBER }]);
  };

  const removeInvite = (id: string) => {
    if (invites.length > 1) {
      onInvitesChange(invites.filter((invite) => invite.id !== id));
      onErrorsChange((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const updateInviteEmail = (id: string, email: string) => {
    onInvitesChange(invites.map((invite) => (invite.id === id ? { ...invite, email } : invite)));

    // Clear error for this field when user starts typing
    if (errors[id]) {
      onErrorsChange((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const updateInviteRole = (id: string, role: OrganizationRole) => {
    onInvitesChange(invites.map((invite) => (invite.id === id ? { ...invite, role } : invite)));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {showLabel && <Label>Team Members</Label>}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          {invites.map((invite) => (
            <div key={invite.id} className="flex flex-col gap-1">
              <div className="flex items-start gap-4">
                <div className="flex flex-1 rounded shadow-border-sm">
                  <Input
                    placeholder="team@example.com"
                    value={invite.email}
                    onChange={(e) => updateInviteEmail(invite.id, e.target.value)}
                    autoFocus
                    className={cn(
                      "flex-1 shadow-none rounded-r-none",
                      errors[invite.id] && "border-destructive"
                    )}
                  />
                  <Select
                    value={invite.role}
                    onValueChange={(value: OrganizationRole) => updateInviteRole(invite.id, value)}
                  >
                    <SelectTrigger className="h-9 w-32 rounded-l-none border-l shadow-none focus:z-[1] md:h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value={OrganizationRole.MEMBER}>Member</SelectItem>
                      <SelectItem value={OrganizationRole.ADMIN}>Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {invites.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInvite(invite.id)}
                    className="-mx-2 h-9 rounded-full text-stone-400 hover:bg-transparent focus:bg-transparent md:h-8"
                  >
                    <CircleMinus className="size-4" />
                  </Button>
                )}
              </div>
              {errors[invite.id] && (
                <p className="my-1 text-xs text-destructive">{errors[invite.id]}</p>
              )}
            </div>
          ))}
        </div>

        <Button variant="nude" onClick={addInvite} className="ml-1.5 h-fit px-0">
          <CirclePlus className="size-4" />
          Add Teammate
        </Button>
      </div>
    </div>
  );
}

export function validateTeamMemberInvites(invites: TeamMemberInvite[]): Record<string, string> {
  const newErrors: Record<string, string> = {};

  invites.forEach((invite) => {
    if (!invite.email.trim()) {
      newErrors[invite.id] = "Email address is required";
    } else if (!isValidEmail(invite.email)) {
      newErrors[invite.id] = "Invalid email address";
    }
  });

  return newErrors;
}

export { generateId };
