"use server";

import { updateCurrentOrganizationBusiness } from "@/app/services/organization/organization-service";
import {
  createSite,
  getCurrentSite,
  updateCurrentSite
} from "@/app/services/site/site-crud-service";
import { uploadLogo } from "@/app/services/site/site-media-service";
import { validateSubdomain } from "@/app/services/site/site-subdomain-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { isGitWalletError } from "@/lib/errors";

export interface OrganizationFormResult {
  success: boolean;
  data?: {
    organizationName: string;
    subdomain?: string;
    country?: string;
    description?: string;
    logoUrl?: string;
  };
  errors?: Record<string, string>;
}

export async function updateOrganization(formData: FormData): Promise<OrganizationFormResult> {
  const organizationName = formData.get("organizationName") as string;
  const subdomain = (formData.get("subdomain") as string)?.toLowerCase();
  const country = formData.get("country") as string;
  const description = formData.get("description") as string;
  const logoFile = formData.get("logo") as File | null;

  // Debug logging
  console.log("Form data received:", {
    organizationName,
    subdomain,
    country,
    description,
    logoFile: logoFile ? { name: logoFile.name, size: logoFile.size, type: logoFile.type } : null
  });

  const errors: Record<string, string> = {};

  if (!organizationName?.trim()) {
    errors.organizationName = "Organization name is required";
  }

  if (subdomain && !subdomain.match(/^[a-z0-9-]+$/)) {
    errors.subdomain = "Subdomain can only contain lowercase letters, numbers, and hyphens";
  }

  // Return early if validation errors
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    const data: OrganizationFormResult["data"] = {
      organizationName: organizationName.trim()
    };

    // Handle subdomain if provided
    if (subdomain?.trim()) {
      const currentSite = await getCurrentSite();
      await validateSubdomain(subdomain, currentSite || undefined);
      data.subdomain = subdomain;
    }

    // Upload logo if provided
    if (logoFile && logoFile.size > 0) {
      console.log("Uploading logo file:", {
        name: logoFile.name,
        size: logoFile.size,
        type: logoFile.type
      });
      try {
        const logoFormData = new FormData();
        logoFormData.append("file", logoFile);
        data.logoUrl = await uploadLogo(logoFormData);
        console.log("Logo uploaded successfully:", data.logoUrl);
      } catch (uploadError) {
        console.error("Logo upload failed:", uploadError);
        throw uploadError;
      }
    }

    const updatePayload: Parameters<typeof updateCurrentOrganizationBusiness>[0] = {
      name: organizationName.trim()
    };

    if (country) {
      updatePayload.businessLocation = country;
      data.country = country;
    }

    if (description !== undefined && description !== null) {
      updatePayload.description = description || null;
      data.description = description;
    }

    await updateCurrentOrganizationBusiness(updatePayload);

    // Handle site creation/update if subdomain is provided
    if (subdomain) {
      const currentSite = await getCurrentSite();

      if (currentSite) {
        // Update existing site
        const siteFormData = new FormData();
        siteFormData.append("subdomain", subdomain);
        if (data.logoUrl) {
          siteFormData.append("logoURL", data.logoUrl);
        }
        await updateCurrentSite(siteFormData);
      } else {
        // Create new site
        const organization = await requireOrganization();
        await createSite(organization.id, subdomain, data.logoUrl);
      }
    }

    return { success: true, data };
  } catch (error) {
    const errorMessage = isGitWalletError(error)
      ? error.message
      : "An error occurred. Please try again.";

    if (errorMessage.toLowerCase().includes("subdomain")) {
      return { success: false, errors: { subdomain: errorMessage } };
    } else if (errorMessage.toLowerCase().includes("name")) {
      return { success: false, errors: { organizationName: errorMessage } };
    } else {
      return { success: false, errors: { _form: errorMessage } };
    }
  }
}
