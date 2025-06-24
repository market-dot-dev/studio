"use client";

import { Organization } from "@/app/generated/prisma";
import { CountrySelect } from "@/components/form/country-select";
import { submitOrganizationForm } from "@/components/organization/organization-form-action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface CustomerOrganizationSettingsFormProps {
  organization: {
    name: Organization["name"];
    businessLocation: Organization["businessLocation"];
  };
}

export function CustomerOrganizationSettingsForm({
  organization
}: CustomerOrganizationSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      setErrors({});
      const { success, errors: errorMessages } = await submitOrganizationForm(formData);

      if (success) {
        toast.success("Organization settings updated successfully");
        router.refresh();
      } else {
        setErrors(errorMessages || {});
      }
    });
  }

  return (
    <form action={handleSubmit} className="flex w-full flex-col gap-y-6">
      {/* Hidden field to indicate this is a customer organization */}
      <input type="hidden" name="organizationType" value="CUSTOMER" />

      <div className="space-y-2">
        <Label htmlFor="organizationName">Organization Name</Label>
        <Input
          id="organizationName"
          name="organizationName"
          defaultValue={organization.name ?? ""}
          required
        />
        {errors.organizationName && (
          <div className="text-xs text-destructive">{errors.organizationName}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <CountrySelect
          name="country"
          defaultValue={organization.businessLocation ?? undefined}
          required
        />
        {errors.country && <div className="text-xs text-destructive">{errors.country}</div>}
      </div>

      {errors._form && <div className="text-xs text-destructive">{errors._form}</div>}

      <SubmitButton loading={isPending}>Save Changes</SubmitButton>
    </form>
  );
}
