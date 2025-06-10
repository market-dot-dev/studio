import { listTiersByOrganizationIdWithCounts } from "@/app/services/tier/tier-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PackageCard, type PackageCardData } from "@/components/onboarding/package-card";
import { DraftPackages } from "./draft-packages";
import { RecreateDraftPackagesButton } from "./recreate-draft-packages-button";

export default async function GeneratePackagesPage() {
  const organization = await requireOrganization();

  if (!organization.description) {
    redirect("/onboarding/business-description");
  }

  const existingPackages = await listTiersByOrganizationIdWithCounts(organization.id);

  if (existingPackages.length === 0) {
    return (
      <DraftPackages organizationId={organization.id} description={organization.description} />
    );
  }

  return (
    <div className="relative space-y-10">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Your Saved Packages</h1>
        <p className="text-sm text-muted-foreground">
          Here are your saved draft packages. You can continue with these or go back to create new
          ones.
        </p>
      </div>

      <div className="mx-auto flex max-w-screen-lg  flex-wrap justify-center gap-6">
        {existingPackages.slice(0, 3).map((pkg) => (
          <div key={pkg.id} className="w-full max-w-[300px]">
            <PackageCard
              pkg={
                {
                  name: pkg.name,
                  tagline: pkg.tagline || "",
                  description: pkg.description || "",
                  price: pkg.price || 0,
                  cadence: pkg.cadence,
                  checkoutType: pkg.checkoutType
                } as PackageCardData
              }
            />
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-stone-150 py-4">
        <div className="mx-auto flex max-w-md flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/onboarding/stripe">Continue</Link>
          </Button>
          <RecreateDraftPackagesButton
            organizationId={organization.id}
            existingPackageIds={existingPackages.map((pkg) => pkg.id)}
            className="text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
}
