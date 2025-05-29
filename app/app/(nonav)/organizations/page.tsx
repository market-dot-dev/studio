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
    <form
      action={switchOrganization.bind(null, id)}
      className="border-b transition-colors first:rounded-t-lg last:rounded-b-lg last:border-b-0 hover:bg-stone-50"
    >
      <button
        type="submit"
        className="group flex w-full items-center justify-between p-4 transition-all duration-200 md:p-5"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="md:text-md flex size-8 shrink-0 items-center justify-center rounded bg-swamp text-base font-bold text-white md:size-10 md:rounded-md md:text-xl">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={name}
                className="size-8 rounded object-cover md:size-10 md:rounded-md"
              />
            ) : (
              getInitials(name).charAt(0)
            )}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <h2 className="line-clamp-2 text-sm font-bold text-foreground md:text-base">{name}</h2>
            <p className="truncate text-xs text-muted-foreground md:text-sm">
              {name.toLowerCase().replace(/\s+/g, "")}.market.dev
            </p>
          </div>
        </div>
        <ChevronRight className="size-4 shrink-0 translate-x-0.5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </form>
  );
}

export default async function OrganizationsPage() {
  const userOrganizations = await getUserOrganizations();

  return (
    <div className="min-h-screen bg-stone-100 px-6 py-10 md:p-12">
      <div className="mx-auto w-full max-w-md space-y-10 text-center md:max-w-lg md:space-y-12">
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <div className="flex justify-center">
            <Image
              src="/gw-logo-nav.png"
              alt="market.dev Logo"
              className="size-8 shrink-0 md:size-10"
              height={40}
              width={40}
              priority
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tightish text-foreground md:text-3xl">
            Your Organizations
          </h1>
        </div>

        <div className="relative">
          <div className="relative z-[1] rounded-lg bg-white shadow-border">
            {userOrganizations.length === 0 ? (
              <div className="rounded-lg bg-white p-6 py-8">
                <p className="text-muted-foreground">You haven't joined any organizations yet.</p>
              </div>
            ) : (
              userOrganizations.map(({ organization }) => (
                <div key={organization.id}>
                  <OrganizationItem
                    id={organization.id}
                    name={organization.name}
                    image={null} // Organizations don't seem to have images yet
                  />
                </div>
              ))
            )}
          </div>

          <div className="z-0 -mt-5 flex flex-col gap-4 rounded-b-lg border bg-stone-150 pt-9">
            <div className="flex items-center gap-2">
              <hr className="flex-1 border-t border-dashed border-stone-300" />
              <p className="flex-none text-center text-xs font-medium text-muted-foreground xs:whitespace-nowrap">
                Want to use market.dev for another project?
              </p>
              <hr className="flex-1 border-t border-dashed border-stone-300" />
            </div>
            <div className="px-4 pb-4 md:px-5 md:pb-5">
              <Button asChild className="w-full gap-2" variant="outline">
                <Link href="/organizations/new">
                  <Building className="size-4" />
                  Create a new organization
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
