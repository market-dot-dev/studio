"use client";

import { ONBOARDING_STEPS } from "@/app/services/onboarding/onboarding-steps";
import { CountrySelect } from "@/components/form/country-select";
import { submitOrganizationForm } from "@/components/organization/organization-form-action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { OnboardingAction } from "../onboarding-action";

interface OrganizationOnboardingFormProps {
  organization?: {
    name?: string | null;
    businessLocation?: string | null;
  };
  currentSite?: {
    subdomain?: string | null;
    logo?: string | null;
  };
  nextPath: string;
}

export function OrganizationOnboardingForm({
  organization,
  currentSite,
  nextPath
}: OrganizationOnboardingFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBeforeAction = async () => {
    if (!formRef.current) {
      throw new Error("Form reference is not available");
    }

    setErrors({});

    const formData = new FormData(formRef.current);
    const { success, errors: errorMessages } = await submitOrganizationForm(formData);

    if (!success) {
      setErrors(errorMessages || {});
      throw new Error("Organization validation failed");
    }
  };

  return (
    <div className="space-y-10">
      <form ref={formRef} className="space-y-6">
        <input type="hidden" name="organizationType" value="VENDOR" />

        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              name="organizationName"
              placeholder="Your Organization Name"
              defaultValue={organization?.name ?? ""}
              required
              autoFocus
            />
            {errors.organizationName && (
              <div className="text-xs text-destructive">{errors.organizationName}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="subdomain">Domain</Label>
            <Input
              id="subdomain"
              name="subdomain"
              placeholder="your-domain"
              defaultValue={currentSite?.subdomain ?? ""}
              suffix=".market.dev"
              pattern="[a-z0-9-]+"
              required
            />
            {errors.subdomain && <div className="text-xs text-destructive">{errors.subdomain}</div>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <CountrySelect
            name="country"
            defaultValue={organization?.businessLocation ?? undefined}
            required
          />
          {errors.country && <div className="text-xs text-destructive">{errors.country}</div>}
        </div>
      </form>
      {errors._form && <div className="text-xs text-destructive">{errors._form}</div>}
      <OnboardingAction
        currentStep={ONBOARDING_STEPS.ORGANIZATION}
        nextPath={nextPath}
        beforeAction={handleBeforeAction}
      />
    </div>
  );
}
