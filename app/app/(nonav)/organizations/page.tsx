import { setCurrentOrganization } from "@/app/services/auth-service";
import { getUserOrganizations } from "@/app/services/organization-service";
import { Button } from "@/components/ui/button";
import { Building, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

interface OrganizationItemProps {
  id: string;
  name: string;
  image?: string | null;
}

async function switchOrganization(organizationId: string) {
  "use server";
  await setCurrentOrganization(organizationId);
  redirect("/");
}

function OrganizationItem({ id, name, image }: OrganizationItemProps) {
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

export default async function OrganizationsPage() {
  const userOrganizations = await getUserOrganizations();

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <div className="mx-auto w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/gw-logo-nav.png"
            alt="market.dev Logo"
            className="size-12 shrink-0"
            height={48}
            width={48}
            priority
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground">Your Organizations</h1>

        {/* Organizations List */}
        <div className="space-y-3 shadow-border-lg">
          {userOrganizations.length === 0 ? (
            <div className="rounded-lg bg-white p-6 py-8">
              <p className="text-muted-foreground">You haven't joined any organizations yet.</p>
            </div>
          ) : (
            userOrganizations.map(({ organization }) => (
              <div key={organization.id} className="rounded-lg bg-white shadow-border-lg">
                <OrganizationItem
                  id={organization.id}
                  name={organization.name}
                  image={null} // Organizations don't seem to have images yet
                />
              </div>
            ))
          )}
        </div>

        {/* Create Organization Section */}
        <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-border-lg">
          <p className="text-muted-foreground">Want to use market.dev for another project?</p>
          <Button asChild className="gap-2">
            <Link href="/organizations/new">
              <Building className="size-4" />
              Create a new organization
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
