import { ONBOARDING_STEPS, getNextStepPath } from "@/app/services/onboarding/onboarding-steps";
import {
  createOrganizationFromOnboarding,
  getCurrentOrganizationForSettings
} from "@/app/services/organization/organization-service";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { submitOrganizationForm } from "@/components/organization/organization-form-action";
import { CurrentOrganizationForSettings } from "@/types/organization";
import { redirect } from "next/navigation";
import { SetupOnboardingForm } from "./organization-onboarding-form";

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

interface SetupOnboardingPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SetupOnboardingPage({ searchParams }: SetupOnboardingPageProps) {
  const params = await searchParams;
  console.log("Params", params);
  const mode = params.mode as string;

  // Add more detailed logging
  console.log("Raw searchParams:", searchParams);
  console.log("Awaited params:", params);
  console.log("Params type:", typeof params);
  console.log("Params keys:", Object.keys(params || {}));
  console.log("Mode specifically:", params?.mode);

  // Get organization
  const org = await getCurrentOrganizationForSettings();

  // Use config to determine behavior
  const config = getOnboardingPageConfig(mode, org);

  // Handle redirects
  if (config.shouldRedirect) {
    redirect(config.redirectTo!);
  }

  // Map action type to actual functions
  const submitAction =
    config.actionType === "create" ? createOrganizationFromOnboarding : submitOrganizationForm;

  const currentStep = ONBOARDING_STEPS["organization"];
  const nextPath = getNextStepPath(currentStep.name);

  return (
    <div className="mx-auto max-w-md space-y-10">
      <OnboardingHeader title={currentStep.title} description={currentStep.description} />
      <SetupOnboardingForm organization={org} onSubmit={submitAction} nextPath={nextPath} />
    </div>
  );
}
