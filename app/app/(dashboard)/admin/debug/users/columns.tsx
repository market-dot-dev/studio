"use client";

import { ColumnDef } from "@tanstack/react-table";
import ImpersonateButton from "./impersonate-button";

// This type represents the shape of our user data
export type User = {
  id: string;
  gh_username?: string;
  email: string;
  name: string;
  roleId: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "gh_username",
    header: "GitHub Username",
    cell: ({ row }) => {
      const username = row.getValue("gh_username") as string | undefined;
      return <div>{username || "N/A"}</div>;
    }
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "roleId",
    header: "Role"
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const userId = row.original.id;
      return <ImpersonateButton userId={userId} />;
    }
  }
];
