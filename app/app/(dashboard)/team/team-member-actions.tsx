"use client";

import { TeamMemberDisplay } from "@/types/team";
import { TeamMemberEditRoleBtn } from "./team-member-edit-role-btn";
import { TeamMemberRemoveBtn } from "./team-member-remove-btn";
import { TeamMemberTransferOwnershipBtn } from "./team-member-transfer-ownership-btn";

interface Props {
  member: TeamMemberDisplay;
}

export function TeamMemberActions({ member }: Props) {
  return (
    <div className="flex items-center">
      <TeamMemberEditRoleBtn member={member} />
      <TeamMemberTransferOwnershipBtn member={member} />
      <TeamMemberRemoveBtn member={member} />
    </div>
  );
}
