"use server";

import { PlanType } from "@/app/generated/prisma";
import { sendWelcomeEmailToMaintainer } from "@/app/services/email-service";
import { requireUser } from "@/app/services/user-context-service";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define the form state for useActionState
export interface CreateOrganizationFormState {
  message: string;
  success: boolean;
  organizationId?: string;
}

export async function createOrganizationAction(
  _prevState: CreateOrganizationFormState,
  formData: FormData
): Promise<CreateOrganizationFormState> {
  // Step 1: Get the current authenticated user
  const user = await requireUser();

  // Step 2: Validate the organization name from the form data
  const schema = z.object({
    organizationName: z.string().min(1, { message: "Organization name is required." }).trim()
  });

  const parseResult = schema.safeParse({
    organizationName: formData.get("organizationName")
  });

  if (!parseResult.success) {
    return { message: parseResult.error.issues[0].message, success: false };
  }

  const { organizationName } = parseResult.data;

  try {
    // Step 3: Create the organization with minimal required data
    const organization = await prisma.$transaction(async (tx) => {
      // Create the organization
      const newOrg = await tx.organization.create({
        data: {
          name: organizationName,
          ownerId: user.id,
          members: {
            create: {
              userId: user.id,
              role: "OWNER"
            }
          },
          billing: {
            create: {
              planType: PlanType.FREE
            }
          }
        }
      });

      // Update the user to make this their current organization
      await tx.user.update({
        where: { id: user.id },
        data: {
          currentOrganizationId: newOrg.id
        }
      });

      return newOrg;
    });

    // Step 4: Send welcome email (outside transaction to avoid blocking)
    try {
      await sendWelcomeEmailToMaintainer(user);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the entire operation if email fails
    }

    // Step 5: Revalidate relevant paths
    revalidatePath("/", "layout");
    revalidatePath("/organizations", "page");

    return {
      message: "Organization created successfully!",
      success: true,
      organizationId: organization.id
    };
  } catch (error) {
    console.error("Failed to create organization:", error);
    return {
      message: "Failed to create organization. Please try again.",
      success: false
    };
  }
}
