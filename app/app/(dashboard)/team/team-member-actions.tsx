"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import { TeamMemberDisplay } from "@/types/team";
import { TeamMemberEditRoleBtn } from "./team-member-edit-role-btn";
import { TeamMemberRemoveBtn } from "./team-member-remove-btn";
import { TeamMemberTransferOwnershipBtn } from "./team-member-transfer-ownership-btn";

interface Props {
  member: TeamMemberDisplay;
  currentUserRole?: OrganizationRole | null;
}

export function TeamMemberActions({ member, currentUserRole }: Props) {
  return (
    <div className="flex items-center">
      <TeamMemberEditRoleBtn member={member} currentUserRole={currentUserRole} />
      <TeamMemberTransferOwnershipBtn member={member} currentUserRole={currentUserRole} />
      <TeamMemberRemoveBtn member={member} currentUserRole={currentUserRole} />
    </div>
  );
}
