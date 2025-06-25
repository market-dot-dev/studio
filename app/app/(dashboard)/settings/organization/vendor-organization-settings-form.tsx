"use client";

import { Organization } from "@/app/generated/prisma";
import { CountrySelect } from "@/components/form/country-select";
import { submitOrganizationForm } from "@/components/organization/organization-form-action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { AppWindowMac, Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface VendorOrganizationSettingsFormProps {
  organization: {
    name: Organization["name"];
    description: Organization["description"];
    businessLocation: Organization["businessLocation"];
    subdomain?: string;
    logo?: string;
  };
}

export function VendorOrganizationSettingsForm({
  organization
}: VendorOrganizationSettingsFormProps) {
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
      {/* Hidden field to indicate this is a vendor organization */}
      <input type="hidden" name="organizationType" value="VENDOR" />

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
        <Label htmlFor="subdomain">Domain</Label>
        <Input
          id="subdomain"
          name="subdomain"
          defaultValue={organization.subdomain ?? ""}
          className="rounded-r-none border-0 shadow-none"
          pattern="[a-z0-9-]+"
          suffix=".market.dev"
          required
        />
        <p className="text-xs text-muted-foreground">
          Your{" "}
          <span className="font-medium text-stone-700">
            <Link className="ml-px mr-1 inline-block size-3.5 -translate-y-0.5" />
            Checkout Links
          </span>{" "}
          and{" "}
          <span className="font-medium text-stone-700">
            <AppWindowMac className="ml-px mr-1 inline-block size-3.5 -translate-y-px" />
            Landing Page
          </span>{" "}
          will live on this url.
        </p>
        {errors.subdomain && <div className="text-xs text-destructive">{errors.subdomain}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <CountrySelect
          name="country"
          defaultValue={organization.businessLocation ?? undefined}
          required
        />
        <p className="text-xs text-muted-foreground">Needed for billing & tax purposes.</p>
        {errors.country && <div className="text-xs text-destructive">{errors.country}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Organization Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your organization"
          defaultValue={organization.description ?? ""}
          className="min-h-40"
        />
        {errors.description && <div className="text-xs text-destructive">{errors.description}</div>}
      </div>

      {errors._form && <div className="text-xs text-destructive">{errors._form}</div>}

      <SubmitButton loading={isPending}>Save Changes</SubmitButton>
    </form>
  );
}
