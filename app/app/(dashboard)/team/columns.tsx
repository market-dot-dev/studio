"use client";

import { OrganizationRole } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { TeamMemberDisplay } from "@/types/team";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { Crown } from "lucide-react";
import { TeamMemberActions } from "./team-member-actions";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    userRole?: OrganizationRole | null;
  }
}

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

      return (
        <Badge variant="secondary">
          {role === OrganizationRole.OWNER && <Crown />}
          {getRoleDisplayName(role)}
        </Badge>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const role = table.options.meta?.userRole;
      return <TeamMemberActions member={row.original} currentUserRole={role} />;
    }
  }
];
