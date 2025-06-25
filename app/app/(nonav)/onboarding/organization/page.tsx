import { ONBOARDING_STEPS, getStepMeta } from "@/app/services/onboarding/onboarding-steps";
import { getCurrentSite } from "@/app/services/site/site-crud-service";
import { getCurrentOrganization } from "@/app/services/user-context-service";
import { OrganizationOnboardingForm } from "./organization-onboarding-form";

export default async function OrganizationOnboardingPage() {
  const organization = await getCurrentOrganization();
  const currentSite = await getCurrentSite();

  const stepMeta = getStepMeta(ONBOARDING_STEPS.ORGANIZATION);

  return (
    <div className="mx-auto max-w-md space-y-10">
      <div className="flex flex-col items-center text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Create Your Organization</h1>
        <p className="text-sm text-muted-foreground">
          We'll use your info to brand your dashboard and checkout links.
        </p>
      </div>

      <OrganizationOnboardingForm
        organization={organization || undefined}
        currentSite={currentSite || undefined}
        nextPath={stepMeta?.nextPath || "/onboarding/team"}
      />
    </div>
  );
}
