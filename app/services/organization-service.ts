import prisma from "@/lib/prisma";
import { getCurrentUserId } from "./session-service";

/**
 * Gets the current organization ID for a user
 */
// @TODO: this could be cleaner with server session, maybe
export async function getCurrentOrganizationId(): Promise<string | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentOrganizationId: true }
  });

  return user?.currentOrganizationId || null;
}
