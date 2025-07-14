import { ONBOARDING_STEPS, getNextStepPath } from "@/app/services/onboarding/onboarding-steps";
import { getCurrentOrganizationForSettings } from "@/app/services/organization/organization-service";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { submitOrganizationForm } from "@/components/organization/organization-form-action";
import { CurrentOrganizationForSettings } from "@/types/organization";
import { OrganizationSetupForm } from "./organization-setup-form";

/**
 * Pure function to determine onboarding page behavior
 */
export function getOnboardingPageConfig(
  mode: string | undefined,
  organization: CurrentOrganizationForSettings | null
) {
  const isCreationMode = mode === "create";

  // Redirect logic: No creation mode + no org = redirect to organizations
  if (!isCreationMode && !organization) {
    return { shouldRedirect: true, redirectTo: "/organizations" };
  }

  // Action selection
  const actionType = isCreationMode ? "create" : "update";

  return {
    shouldRedirect: false,
    actionType,
    organization,
    isCreationMode
  };
}

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
