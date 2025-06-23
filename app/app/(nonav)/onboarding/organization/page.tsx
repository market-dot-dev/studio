import { ONBOARDING_STEPS, getStepMeta } from "@/app/services/onboarding/onboarding-steps";
import { getCurrentSite } from "@/app/services/site/site-crud-service";
import { getCurrentOrganization } from "@/app/services/user-context-service";
import { OrganizationOnboardingClient } from "./organization-onboarding-client";

export default async function OrganizationOnboardingPage() {
  // Fetch current organization and site data for pre-filling
  const organization = await getCurrentOrganization();
  const currentSite = await getCurrentSite();

  // Get step metadata
  const stepMeta = getStepMeta(ONBOARDING_STEPS.ORGANIZATION);

  return (
    <OrganizationOnboardingClient
      organization={organization}
      currentSite={currentSite}
      nextPath={stepMeta?.nextPath || "/onboarding/team"}
    />
  );
}
