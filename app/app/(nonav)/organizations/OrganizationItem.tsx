import { setCurrentOrganization } from "@/app/services/auth-service";
import { ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

async function switchOrganization(organizationId: string) {
  "use server";
  await setCurrentOrganization(organizationId);
  redirect("/");
}

interface OrganizationItemProps {
  id: string;
  name: string;
  image?: string | null;
}

export function OrganizationItem({ id, name, image }: OrganizationItemProps) {
  return (
    <form action={switchOrganization.bind(null, id)}>
      <button
        type="submit"
        className="group flex w-full items-center justify-between p-4 transition-all duration-200 hover:bg-stone-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-swamp text-sm font-bold text-white">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={name} className="size-12 rounded-lg object-cover" />
            ) : (
              getInitials(name).charAt(0)
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg font-bold text-foreground">{name}</span>
            <span className="text-sm text-muted-foreground">
              {name.toLowerCase().replace(/\s+/g, "")}.market.dev
            </span>
          </div>
        </div>
        <ChevronRight className="size-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </form>
  );
}
