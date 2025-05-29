"use client";

import { setCurrentOrganization } from "@/app/services/auth-service";
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
      className="group flex w-full items-center justify-between p-4 transition-all duration-200 hover:bg-stone-50 disabled:opacity-50"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-lg bg-swamp text-sm font-bold text-white">
          {getInitials(organization.name).charAt(0)}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-lg font-bold text-foreground">{organization.name}</span>
          <span className="text-sm text-muted-foreground">
            {subdomain
              ? `${subdomain}.market.dev`
              : `${organization.name.toLowerCase().replace(/\s+/g, "")}.market.dev`}
          </span>
        </div>
      </div>
      <ChevronRight className="size-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
    </button>
  );
}
