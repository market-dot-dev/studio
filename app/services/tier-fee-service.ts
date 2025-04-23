"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./UserService";

/**
 * Updates the application fee percentage and price for a tier
 *
 * @param tierId - The ID of the tier to update
 * @param applicationFeePercent - The application fee percentage to set
 * @param applicationFeePrice - The application fee price to set
 * @returns The updated tier
 * @throws Error if user doesn't have admin permissions
 */
export async function updateApplicationFee(
  tierId: string,
  applicationFeePercent?: number,
  applicationFeePrice?: number
) {
  const user = await getCurrentUser();
  if (!user?.roleId || user.roleId !== "admin") {
    throw new Error("User does not have permission to update application fee percent.");
  }

  return await prisma?.tier.update({
    where: { id: tierId },
    data: { applicationFeePercent, applicationFeePrice }
  });
}
