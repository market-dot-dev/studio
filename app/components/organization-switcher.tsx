"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MinimalOrganization } from "@/types/organization";
import { ArrowLeftRight, ChevronsUpDown, Settings, UsersRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Placeholder data for other organizations
const otherOrganizations = [
  { id: "1", name: "Acme Inc.", imageUrl: null },
  { id: "2", name: "TechCorp", imageUrl: null },
  { id: "3", name: "StartupXYZ", imageUrl: null },
  { id: "4", name: "Enterprise Solutionssssss", imageUrl: null }
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

interface OrganizationDisplayProps {
  name: string;
  imageUrl?: string | null;
  className?: string;
}

function OrganizationDisplay({ name, imageUrl, className = "" }: OrganizationDisplayProps) {
  return (
    <div className={`flex items-center gap-2 overflow-auto ${className}`}>
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-[3px] bg-swamp text-xs font-bold text-white`}
      >
        {name ? getInitials(name).charAt(0) : "?"}
      </span>
      <span className="truncate text-sm font-semibold leading-none tracking-tightish text-foreground">
        {name}
      </span>
    </div>
  );
}

interface Props {
  currentOrg: MinimalOrganization;
}

export function OrganizationSwitcher({ currentOrg }: Props) {
  const [selectedOrgId, setSelectedOrgId] = useState(currentOrg.id);
  const selectedOrg = otherOrganizations.find((org) => org.id === selectedOrgId) || currentOrg;

  const handleOrganizationSwitch = (orgId: string) => {
    setSelectedOrgId(orgId);
    // TODO: Implement actual organization switching logic
    console.log("Switching to organization with ID:", orgId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mb-3 flex w-full items-center gap-1 rounded bg-white p-1 text-left text-sm font-medium shadow-border-sm transition-[background-color,box-shadow] hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-swamp dark:hover:bg-stone-800">
        <OrganizationDisplay name={selectedOrg.name} imageUrl={selectedOrg.imageUrl} />
        <ChevronsUpDown className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-full min-w-[225px] bg-stone-100 p-0">
        <div className="flex flex-col rounded-b-md bg-white p-2 shadow-sm ring-1 ring-black/5">
          <div className="px-1 pb-2 pt-[3px]">
            <OrganizationDisplay name={selectedOrg.name} imageUrl={selectedOrg.imageUrl} />
          </div>
          <DropdownMenuItem
            asChild
            className="gap-2 p-1 transition-[background-color,box-shadow] hover:cursor-pointer hover:bg-white hover:shadow-border hover:ring-0 focus:bg-white focus:ring-2 focus:ring-swamp"
          >
            <Link href="/team">
              <UsersRound className="!h-4.5 !w-4.5 shrink-0" />
              Team
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="gap-2 p-1 transition-[background-color,box-shadow] hover:cursor-pointer hover:bg-white hover:shadow-border hover:ring-0 focus:bg-white focus:ring-2 focus:ring-swamp"
          >
            <Link href="/settings/business">
              <Settings className="!h-4.5 !w-4.5 shrink-0" />
              Organization Settings
            </Link>
          </DropdownMenuItem>
        </div>
        <div className="flex flex-col p-2">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2 p-1 font-medium transition-[background-color,box-shadow] hover:cursor-pointer hover:bg-white hover:shadow-border hover:ring-0 focus:bg-white focus:ring-2 focus:ring-swamp">
              <ArrowLeftRight className="!h-4.5 !w-4.5 shrink-0" />
              Switch Organization
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="flex min-w-[200px] flex-col border">
                {otherOrganizations.map((org) => (
                  <DropdownMenuCheckboxItem
                    key={org.id}
                    checked={selectedOrgId === org.id}
                    onCheckedChange={() => handleOrganizationSwitch(org.id)}
                    className="h-7 p-1 pr-9 transition-[background-color,box-shadow] hover:cursor-pointer hover:bg-white hover:shadow-border focus:bg-white focus:ring-2 focus:ring-swamp"
                  >
                    <OrganizationDisplay
                      name={org.name}
                      imageUrl={org.imageUrl}
                      className="flex-1"
                    />
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {/* @TODO: Org-creation */}
          {/* <DropdownMenuItem
            asChild
            className="gap-2 p-1 transition-[background-color,box-shadow] hover:cursor-pointer hover:bg-white hover:shadow-border hover:ring-0 focus:bg-white focus:ring-2 focus:ring-swamp"
          >
            <Link href="/organizations/new">
              <SquarePlus className="!h-4.5 !w-4.5 shrink-0" />
              Create an Organization
            </Link>
          </DropdownMenuItem> */}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
