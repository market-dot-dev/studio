import { ONBOARDING_STEPS, getNextStepPath } from "@/app/services/onboarding/onboarding-steps";
import { getCurrentOrganizationForSettings } from "@/app/services/organization/organization-service";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { OrganizationOnboardingForm } from "./organization-onboarding-form";

export default async function OrganizationOnboardingPage() {
  const org = await getCurrentOrganizationForSettings();

  const currentStep = ONBOARDING_STEPS["organization"];
  const nextPath = getNextStepPath(currentStep.name);

  return (
    <div className="mx-auto max-w-md space-y-10">
      <OnboardingHeader title={currentStep.title} description={currentStep.description} />
      <OrganizationOnboardingForm organization={org} nextPath={nextPath} />
    </div>
  );
}
