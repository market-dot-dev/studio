"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn, generateId } from "@/lib/utils";
import { CircleMinus, CirclePlus } from "lucide-react";

export interface TeamMemberInvite {
  id: string;
  email: string;
  role: OrganizationRole;
}

interface TeamMemberInviteFieldsProps {
  invites: TeamMemberInvite[];
  onInvitesChange: (invites: TeamMemberInvite[]) => void;
  className?: string;
}

export function TeamMemberInviteFields({
  invites,
  onInvitesChange,
  className
}: TeamMemberInviteFieldsProps) {
  const addInvite = () => {
    onInvitesChange([...invites, { id: generateId(), email: "", role: OrganizationRole.MEMBER }]);
  };

  const removeInvite = (id: string) => {
    if (invites.length > 1) {
      onInvitesChange(invites.filter((invite) => invite.id !== id));
    }
  };

  const updateInviteEmail = (id: string, email: string) => {
    onInvitesChange(invites.map((invite) => (invite.id === id ? { ...invite, email } : invite)));
  };

  const updateInviteRole = (id: string, role: OrganizationRole) => {
    onInvitesChange(invites.map((invite) => (invite.id === id ? { ...invite, role } : invite)));
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-2">
        {invites.map((invite) => (
          <div key={invite.id} className="flex items-start gap-4">
            <div className="flex flex-1 rounded shadow-border-sm">
              <Input
                placeholder="team@example.com"
                value={invite.email}
                onChange={(e) => updateInviteEmail(invite.id, e.target.value)}
                required
                autoFocus
                className={cn("flex-1 shadow-none rounded-r-none")}
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
        ))}
      </div>

      <Button type="button" variant="nude" onClick={addInvite} className="ml-1.5 h-fit px-0">
        <CirclePlus className="size-4" />
        Add Teammate
      </Button>
    </div>
  );
}
