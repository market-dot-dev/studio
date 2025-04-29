"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ArrowLeftRight, Building, ChevronsUpDown, Settings, SquarePlus } from "lucide-react";
import Link from "next/link";

// Placeholder data - replace with actual data fetching later
const currentOrganization = {
  name: "Acme Inc.",
  imageUrl: null // Or a URL string
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function OrganizationSwitcher() {
  const organizationName = currentOrganization.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:ring-swamp shadow-border-sm mb-3 flex w-full items-center gap-3 rounded bg-white p-1 text-left text-sm font-medium transition-colors hover:bg-stone-100 focus:outline-none focus:ring-2 dark:hover:bg-stone-800">
        <div className="flex items-center gap-2">
          <span className="bg-swamp  flex size-[18px] items-center justify-center rounded-[3px] text-xs font-bold text-white">
            {organizationName ? getInitials(organizationName).charAt(0) : "?"}
          </span>
          <span className="tracking-tightish truncate font-semibold leading-none">
            {organizationName}
          </span>
        </div>
        <ChevronsUpDown className="ml-auto size-3.5 shrink-0 text-stone-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        alignOffset={-8}
        className="min-w-[var(--navWidth)] bg-stone-100 p-0"
      >
        <div className="flex flex-col rounded-b-md bg-white p-2 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-2 px-1 pb-2 pt-[3px]">
            <span className="bg-swamp  flex size-[18px] items-center justify-center rounded-[3px] text-xs font-bold text-white">
              {organizationName ? getInitials(organizationName).charAt(0) : "?"}
            </span>
            <span className="tracking-tightish leading-0 truncate text-sm font-semibold">
              {organizationName}
            </span>
          </div>
          <DropdownMenuItem
            className="hover:shadow-border focus-visible:ring-swamp p-1 transition-[background-color,box-shadow] hover:bg-white focus:bg-white focus-visible:ring-2"
            asChild
          >
            <Link href="/team" className="flex items-center gap-2">
              <Building className="!h-4.5 !w-4.5 shrink-0" />
              Team
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="hover:shadow-border focus-visible:ring-swamp p-1 transition-[background-color,box-shadow] hover:bg-white focus:bg-white focus-visible:ring-2"
          >
            <Link href="/settings/project" className="flex items-center gap-2">
              <Settings className="!h-4.5 !w-4.5 shrink-0" />
              Settings
            </Link>
          </DropdownMenuItem>
        </div>
        <div className="flex flex-col p-2">
          <DropdownMenuItem
            className="hover:shadow-border focus-visible:ring-swamp p-1 transition-[background-color,box-shadow] hover:bg-white focus:bg-white focus-visible:ring-2"
            onSelect={() => alert("Open Switch Org Modal")}
          >
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-4.5 w-4.5 shrink-0" />
              Switch Organization
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:shadow-border focus-visible:ring-swamp p-1 transition-[background-color,box-shadow] hover:bg-white focus:bg-white focus-visible:ring-2"
            onSelect={() => alert("Navigate to Create New Org")}
          >
            <div className="flex items-center gap-2">
              <SquarePlus className="h-4.5 w-4.5 shrink-0" />
              Create an Organization
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
