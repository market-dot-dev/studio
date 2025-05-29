import { getOrganizationSwitcherContext } from "@/app/services/user-context-service";
import Image from "next/image";
import { OrganizationItem } from "./OrganizationItem";

export default async function OrganizationsPage() {
  const { availableOrganizations: orgs } = await getOrganizationSwitcherContext();

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <div className="mx-auto w-full max-w-md space-y-8 text-center">
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

        <h1 className="text-2xl font-bold text-foreground">Your Organizations</h1>

        <div className="space-y-3 shadow-border-lg">
          {orgs.length === 0 ? (
            <div className="rounded-lg bg-white p-6 py-8">
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
        {/* <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-border-lg">
          <p className="text-muted-foreground">Want to use market.dev for another project?</p>
          <Button asChild className="gap-2">
            <Link href="/organizations/new">
              <Building className="size-4" />
              Create a new organization
            </Link>
          </Button>
        </div> */}
      </div>
    </div>
  );
}
