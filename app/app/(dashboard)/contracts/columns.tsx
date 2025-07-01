"use client";

import { Contract } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SessionUser } from "@/types/session";
import { ColumnDef } from "@tanstack/react-table";
import { BookOpen, Edit, MoreVertical, ShieldCheck } from "lucide-react";
import Link from "next/link";

// Cell component for the name column that handles different display based on ownership
const NameCell = ({
  contract,
  currentUser
}: {
  contract: Contract;
  currentUser: SessionUser | null | undefined;
}) => {
  // If currentUser is null or undefined, we can't determine ownership yet
  if (currentUser === null || currentUser === undefined) {
    return (
      <div>
        <Link href={`/c/contracts/${contract.id}`} target="_blank" className="hover:underline">
          {contract.name}
        </Link>
      </div>
    );
  }

  const ownsContract = contract.organizationId === currentUser.currentOrgId;

  return (
    <div className="flex items-center gap-2">
      {ownsContract ? (
        <Link href={`/contracts/${contract.id}`} className="hover:underline">
          {contract.name}
        </Link>
      ) : (
        <>
          <Link href={`/c/contracts/${contract.id}`} target="_blank" className="hover:underline">
            {contract.name}
          </Link>
          <Badge
            variant="secondary"
            className="flex size-5 items-center justify-center p-0"
            tooltip="This is a standard open source contract provided by market.dev"
          >
            <ShieldCheck className="size-3.5" strokeWidth={2.25} />
          </Badge>
        </>
      )}
    </div>
  );
};

// Cell component for actions column
const ActionsCell = ({
  contract,
  currentUser
}: {
  contract: Contract;
  currentUser: SessionUser | null | undefined;
}) => {
  // If currentUser is null or undefined, don't render actions yet
  if (currentUser === null || currentUser === undefined) {
    return <div className="flex justify-end"></div>;
  }

  const ownsContract = contract.organizationId === currentUser.currentOrgId;

  if (!ownsContract) {
    return (
      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href={`/c/contracts/${contract.id}`} target="_blank">
            <BookOpen className="mr-1 size-4" />
            Read
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/contracts/${contract.id}`}>
              <Edit />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/c/contracts/${contract.id}`} target="_blank">
              <BookOpen />
              Read
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const createColumns = (
  currentUser: SessionUser | null | undefined
): ColumnDef<Contract>[] => [
  {
    accessorKey: "name",
    header: "Name",
    meta: {
      emphasized: true
    },
    cell: ({ row }) => <NameCell contract={row.original} currentUser={currentUser} />
  },
  {
    accessorKey: "description",
    header: "Description"
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell contract={row.original} currentUser={currentUser} />
  }
];
