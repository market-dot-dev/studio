"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { TeamMemberDisplay } from "@/types/team";
import { ColumnDef } from "@tanstack/react-table";
import { Crown } from "lucide-react";
import { TeamMemberActions } from "./team-member-actions";

const getRoleBadgeVariant = (role: OrganizationRole) => {
  switch (role) {
    case OrganizationRole.OWNER:
      return "default";
    case OrganizationRole.ADMIN:
      return "secondary";
    case OrganizationRole.MEMBER:
      return "outline";
  }
};

const getRoleDisplayName = (role: OrganizationRole) => {
  switch (role) {
    case OrganizationRole.OWNER:
      return "Owner";
    case OrganizationRole.ADMIN:
      return "Admin";
    case OrganizationRole.MEMBER:
      return "Member";
  }
};

export const columns: ColumnDef<TeamMemberDisplay>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string | null;
      const email = row.getValue("email") as string;
      return (
        <div className="flex items-center gap-2 font-semibold text-stone-800">{name || email}</div>
      );
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div>{row.getValue("email")}</div>;
    }
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as OrganizationRole;
      const isPending = row.original.invitePending;

      return (
        <div className="flex items-center gap-2">
          <Badge variant={getRoleBadgeVariant(role)}>
            {role === OrganizationRole.OWNER && <Crown className="mr-1 size-3" />}
            {getRoleDisplayName(role)}
          </Badge>
          {isPending && (
            <Badge variant="secondary" className="text-xs">
              Pending
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <TeamMemberActions member={row.original} />;
    }
  }
];
