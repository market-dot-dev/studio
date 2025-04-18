"use client";

import { buttonVariants } from "@/components/ui/button";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ReactNode } from "react";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <pre>{row.getValue("id")}</pre>
  },
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => {
      const company = row.getValue("company") as string | null;
      return company || "(Unknown)";
    }
  },
  {
    accessorKey: "gh_username",
    header: "Github",
    cell: ({ row }) => {
      const username = row.getValue("gh_username") as string;
      return (
        <a href={`https://www.github.com/${username}`} className="underline">
          {username}
        </a>
      );
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="flex items-center gap-4">
          <Link href={`mailto:${email}`} className="underline">
            {email}
          </Link>
          <Link href={`mailto:${email}`} className={buttonVariants({ variant: "outline" })}>
            Contact
          </Link>
        </div>
      );
    }
  }
];

// Customer Overview Table
export type KeyValuePair = {
  field: string;
  value: string | number | ReactNode | null;
};

export const customerOverviewColumns: ColumnDef<KeyValuePair>[] = [
  {
    accessorKey: "field",
    header: "Field",
    cell: ({ row }) => <strong>{row.getValue("field")}</strong>
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const value = row.getValue("value");
      return value;
    }
  }
];

// Subscription Table
export type CustomerSubscription = {
  id: string;
  tier: {
    name: string;
    price: number | null;
  };
  tierVersionId: string | null;
  status: string;
  createdAt: string;
  cancelledAt: string | null;
};

export const subscriptionColumns: ColumnDef<KeyValuePair>[] = [
  {
    accessorKey: "field",
    header: "Field",
    cell: ({ row }) => <strong>{row.getValue("field")}</strong>
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const value = row.getValue("value");
      return value;
    }
  }
];

// Charge Table
export type CustomerCharge = {
  id: string;
  tier: {
    name: string;
    price: number | null;
  };
  createdAt: string;
};

export const chargeColumns: ColumnDef<KeyValuePair>[] = [
  {
    accessorKey: "field",
    header: "Field",
    cell: ({ row }) => <strong>{row.getValue("field")}</strong>
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const value = row.getValue("value");
      return value;
    }
  }
];
