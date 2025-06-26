import { ONBOARDING_STEPS, getNextStepPath } from "@/app/services/onboarding/onboarding-steps";
import { getCurrentSite } from "@/app/services/site/site-crud-service";
import { getCurrentOrganization } from "@/app/services/user-context-service";
import { OrganizationOnboardingForm } from "./organization-onboarding-form";

export default async function OrganizationOnboardingPage() {
  const organization = await getCurrentOrganization();
  const currentSite = await getCurrentSite();

  const currentStep = ONBOARDING_STEPS["organization"];
  const nextPath = getNextStepPath(currentStep.name);

  return (
    <div className="mx-auto max-w-md space-y-10">
      <div className="flex flex-col items-center text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">{currentStep.title}</h1>
        <p className="text-sm text-muted-foreground">{currentStep.description}</p>
      </div>

      <OrganizationOnboardingForm
        organization={organization || undefined}
        currentSite={currentSite || undefined}
        nextPath={nextPath}
      />
    </div>
  );
}
