"use client";

import { setCurrentOrganization } from "@/app/services/user-context-service";
import { OrganizationForSwitcher } from "@/types/organization";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

interface OrganizationItemProps {
  organization: OrganizationForSwitcher;
}

export function OrganizationItem({ organization }: OrganizationItemProps) {
  const { update } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSwitchOrganization = () => {
    startTransition(async () => {
      try {
        // Update the organization in the database
        await setCurrentOrganization(organization.id);

        // Trigger session update to refresh JWT with new organization context
        await update();

        // Navigate to home page
        router.push("/");
      } catch (error) {
        console.error("Failed to switch organization:", error);
      }
    });
  };

  const subdomain = organization.sites[0]?.subdomain;

  return (
    <button
      onClick={handleSwitchOrganization}
      disabled={isPending}
      className="group flex w-full items-center justify-between p-4 disabled:opacity-50 md:p-5"
    >
      <div className="flex items-center gap-3">
        <div className="text-md flex size-9 shrink-0 items-center justify-center rounded bg-swamp font-bold text-white md:size-11 md:rounded-md md:text-lg">
          {getInitials(organization.name).charAt(0)}
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-sm font-bold tracking-tightish text-foreground md:text-base">
            {organization.name}
          </span>
          <span className="text-xs text-muted-foreground md:text-sm">
            {subdomain
              ? `${subdomain}.market.dev`
              : `${organization.name.toLowerCase().replace(/\s+/g, "")}.market.dev`}
          </span>
        </div>
      </div>
      <ChevronRight className="size-4 translate-x-1 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1.5" />
    </button>
  );
}
