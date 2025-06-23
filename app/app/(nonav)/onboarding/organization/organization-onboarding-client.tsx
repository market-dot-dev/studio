"use client";

import { ONBOARDING_STEPS } from "@/app/services/onboarding/onboarding-steps";
import {
  OrganizationCountryField,
  OrganizationForm,
  OrganizationFormColumn,
  OrganizationFormFields,
  OrganizationFormRow,
  OrganizationLogoField,
  OrganizationNameField,
  OrganizationSubdomainField,
  organizationFormAction
} from "@/components/organization/organization-form";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { OnboardingActions } from "../onboarding-actions";

interface OrganizationOnboardingClientProps {
  organization: any;
  currentSite: any;
  nextPath: string;
}

export function OrganizationOnboardingClient({
  organization,
  currentSite,
  nextPath
}: OrganizationOnboardingClientProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [canContinue, setCanContinue] = useState(true);

  const handleBeforeAction = async () => {
    if (!formRef.current) return;

    // Get form data
    const formData = new FormData(formRef.current);

    // Run the organization form action
    const result = await organizationFormAction(formData);

    if (!result.success) {
      // Show error toast if there are errors
      const errorMessage = result.errors?._form || "Please fix the errors above";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="space-y-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Create Your Organization</h1>
          <p className="text-sm text-muted-foreground">
            We'll use your info to brand your dashboard and checkout links.
          </p>
        </div>

        <OrganizationForm ref={formRef} disableAction>
          <OrganizationFormFields>
            <OrganizationFormRow>
              <OrganizationLogoField currentLogo={currentSite?.logo} />
              <OrganizationFormColumn>
                <OrganizationNameField defaultValue={organization?.name || ""} />
                <OrganizationSubdomainField defaultValue={currentSite?.subdomain || ""} />
              </OrganizationFormColumn>
            </OrganizationFormRow>
            <OrganizationCountryField defaultValue={organization?.businessLocation || ""} />
          </OrganizationFormFields>
        </OrganizationForm>

        <OnboardingActions
          currentStep={ONBOARDING_STEPS.ORGANIZATION}
          nextPath={nextPath}
          beforeAction={handleBeforeAction}
          canContinue={canContinue}
        />
      </div>
    </div>
  );
}
