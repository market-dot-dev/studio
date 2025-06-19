"use server";

import { updateOrganization } from "@/app/services/organization/organization-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { redirect } from "next/navigation";

export async function submitBusinessDescription(prevState: any, formData: FormData) {
  const businessDescription = formData.get("businessDescription") as string;

  if (!businessDescription?.trim()) {
    return {
      error: "Business description is required",
      fields: {
        businessDescription: businessDescription || ""
      }
    };
  }

  if (businessDescription.trim().length < 50) {
    return {
      error: "Please share a little bit more detail",
      fields: {
        businessDescription: businessDescription
      }
    };
  }

  try {
    const organization = await requireOrganization();
    await updateOrganization(organization.id, {
      description: businessDescription.trim()
    });
  } catch (error) {
    console.error("Error saving business description:", error);
    return {
      error: "An error occurred while saving your description. Please try again.",
      fields: {
        businessDescription: businessDescription
      }
    };
  }

  redirect("/onboarding/packages");
}
