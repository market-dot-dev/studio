"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { TeamMemberDisplay } from "@/types/team";
import { MoreHorizontal } from "lucide-react";
import { TeamMemberEditRoleBtn } from "./team-member-edit-role-btn";
import { TeamMemberRemoveBtn } from "./team-member-remove-btn";

interface Props {
  member: TeamMemberDisplay;
  currentUserRole?: OrganizationRole | null;
}

export function TeamMemberActions({ member, currentUserRole }: Props) {
  const isOwner = member.role === OrganizationRole.OWNER;

  if (isOwner) {
    return null;
  }

  const canEdit =
    currentUserRole === OrganizationRole.OWNER || currentUserRole === OrganizationRole.ADMIN;
  const isPendingInvite = member.invitePending;
  const canRemove = canEdit && !isOwner;

  if ((isPendingInvite && !canRemove) || (!canEdit && !canRemove)) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <TeamMemberEditRoleBtn member={member} currentUserRole={currentUserRole} />
        <TeamMemberRemoveBtn member={member} currentUserRole={currentUserRole} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
