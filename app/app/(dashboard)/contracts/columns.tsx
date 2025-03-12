"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Contract } from "@prisma/client"
import Link from "next/link"
import { SessionUser } from "@/app/models/Session"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Edit, BookOpen, MoreVertical, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Cell component for the name column that handles different display based on ownership
const NameCell = ({ 
  contract, 
  currentUser 
}: { 
  contract: Contract, 
  currentUser: SessionUser | null | undefined 
}) => {
  // If currentUser is null or undefined, we can't determine ownership yet
  if (currentUser === null || currentUser === undefined) {
    return <div>{contract.name}</div>;
  }
  
  const ownsContract = contract.maintainerId === currentUser.id;
  
  return (
    <div className="flex items-center gap-2">
      {ownsContract ? (
        contract.name
      ) : (
        <>
          <span>{contract.name}</span>
          <Badge
            variant="secondary"
            className="pl-1"
            tooltip="This is a standard open source contract provided by market.dev"
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1" strokeWidth={2.25} />
            Standard
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
  contract: Contract,
  currentUser: SessionUser | null | undefined
}) => {
  // If currentUser is null or undefined, don't render actions yet
  if (currentUser === null || currentUser === undefined) {
    return <div className="flex justify-end"></div>;
  }
  
  const ownsContract = contract.maintainerId === currentUser.id;
  
  if (!ownsContract) {
    return (
      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href={`/c/contracts/${contract.id}`} target="_blank">
            <BookOpen className="h-4 w-4 mr-1" />
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
            <MoreVertical className="h-4 w-4" />
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
  currentUser: SessionUser | null | undefined,
  onRowClick: (contract: Contract) => void
): ColumnDef<Contract>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <NameCell contract={row.original} currentUser={currentUser} />
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell contract={row.original} currentUser={currentUser} />
  }
] 