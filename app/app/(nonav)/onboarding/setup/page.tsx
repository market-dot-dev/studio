import { ONBOARDING_STEPS, getNextStepPath } from "@/app/services/onboarding/onboarding-steps";
import { getCurrentOrganizationForSettings } from "@/app/services/organization/organization-service";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { submitOrganizationForm } from "@/components/organization/organization-form-action";
import { OrganizationSetupForm } from "./organization-setup-form";

export default async function OrganizationSetupPage() {
  const org = await getCurrentOrganizationForSettings();

  const currentStep = ONBOARDING_STEPS["setup"];
  const nextPath = getNextStepPath(currentStep.name);

  return (
    <div className="mx-auto max-w-md">
      <div className="space-y-10">
        <OnboardingHeader title={currentStep.title} description={currentStep.description} />
        <OrganizationSetupForm
          organization={org}
          onSubmit={submitOrganizationForm}
          nextPath={nextPath}
        />
      </div>
    </div>
  );
}
