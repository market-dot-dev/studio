"use server";

import { updateCurrentOrganizationBusiness } from "@/app/services/organization/organization-service";
import {
  createSite,
  getCurrentSite,
  updateCurrentSite
} from "@/app/services/site/site-crud-service";
import { validateSubdomain } from "@/app/services/site/site-subdomain-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { isGitWalletError } from "@/lib/errors";

export interface OrganizationFormResult {
  success: boolean;
  errors?: Record<string, string>;
}

export async function submitOrganizationForm(formData: FormData): Promise<OrganizationFormResult> {
  const organizationName = formData.get("organizationName") as string;
  const subdomain = (formData.get("subdomain") as string)?.toLowerCase();
  const country = formData.get("country") as string;
  const description = formData.get("description") as string;
  const organizationType = formData.get("organizationType") as string;

  // Customer organizations don't require subdomains
  const requireSubdomain = organizationType !== "CUSTOMER";

  const errors: Record<string, string> = {};

  if (!organizationName?.trim()) {
    errors.organizationName = "Organization name is required";
  }

  if (requireSubdomain && !subdomain?.trim()) {
    errors.subdomain = "Pick a domain";
  }

  if (!country) {
    errors.country = "Select your organization's country";
  }

  // Return early if validation errors
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    // Handle subdomain validation if provided
    if (subdomain?.trim()) {
      const currentSite = await getCurrentSite();
      await validateSubdomain(subdomain, currentSite || undefined);
    }

    const updatePayload: Parameters<typeof updateCurrentOrganizationBusiness>[0] = {
      name: organizationName.trim(),
      businessLocation: country,
      description: description?.trim()
    };

    await updateCurrentOrganizationBusiness(updatePayload);

    // Handle site creation/update if subdomain is provided
    if (subdomain) {
      const currentSite = await getCurrentSite();

      if (currentSite) {
        // Update existing site
        const siteFormData = new FormData();
        siteFormData.append("subdomain", subdomain);
        await updateCurrentSite(siteFormData);
      } else {
        // Create new site
        const organization = await requireOrganization();
        await createSite(organization.id, subdomain);
      }
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    const errorMessage = isGitWalletError(error)
      ? error.message
      : "An error occurred. Please try again.";

    if (errorMessage.toLowerCase().includes("subdomain")) {
      return { success: false, errors: { subdomain: errorMessage } };
    }

    if (errorMessage.toLowerCase().includes("name")) {
      return { success: false, errors: { organizationName: errorMessage } };
    }

    return { success: false, errors: { _form: errorMessage } };
  }
}
