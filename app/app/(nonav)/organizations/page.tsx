import { getOrganizationSwitcherContext } from "@/app/services/user-context-service";
import Image from "next/image";
import { OrganizationItem } from "./OrganizationItem";

export default async function OrganizationsPage() {
  const { availableOrganizations: orgs } = await getOrganizationSwitcherContext();

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
            {orgs.length === 0 ? (
              <div className="p-6 py-8">
                <p className="text-muted-foreground">You haven't joined any organizations yet.</p>
              </div>
            ) : (
              orgs.map(({ organization }) => (
                <div key={organization.id} className="rounded-lg bg-white shadow-border-lg">
                  <OrganizationItem organization={organization} />
                </div>
              ))
            )}
          </div>

          {/* @TODO: Org-Creation */}
          {/* <div className="z-0 -mt-5 flex flex-col gap-4 rounded-b-lg border bg-stone-150 pt-9">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
