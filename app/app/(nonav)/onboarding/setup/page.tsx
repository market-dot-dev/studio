import { ONBOARDING_STEPS, getNextStepPath } from "@/app/services/onboarding/onboarding-steps";
import {
  createOrganizationFromOnboarding,
  getCurrentOrganizationForSettings
} from "@/app/services/organization/organization-service";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { submitOrganizationForm } from "@/components/organization/organization-form-action";
import { Button } from "@/components/ui/button";
import { CurrentOrganizationForSettings } from "@/types/organization";
import Link from "next/link";
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
  const mode = params.mode as string;

  // Get organization
  const org = await getCurrentOrganizationForSettings();

  // Use config to determine behavior
  const config = getOnboardingPageConfig(mode, org);

  // Handle redirects
  if (config.shouldRedirect) {
    redirect(config.redirectTo!);
  }

  // Map action type to actual functions
  const isCreationMode = config.actionType === "create";
  const submitAction = isCreationMode ? createOrganizationFromOnboarding : submitOrganizationForm;

  const currentStep = ONBOARDING_STEPS["organization"];
  const nextPath = getNextStepPath(currentStep.name);

  return (
    <div className="mx-auto max-w-md">
      <div className="space-y-10">
        <OnboardingHeader title={currentStep.title} description={currentStep.description} />
        <SetupOnboardingForm
          organization={isCreationMode ? null : org}
          onSubmit={submitAction}
          nextPath={nextPath}
        />
      </div>
      {isCreationMode && (
        <div className="mt-2">
          <Button asChild className="w-full gap-2" variant="outline">
            <Link href="/organizations">Cancel</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
