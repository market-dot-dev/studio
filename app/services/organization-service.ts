"use server";

import prisma from "@/lib/prisma";
import { requireUser } from "./user-context-service";

/**
 * Get an organization by ID
 *
 * @param id The organization ID to fetch
 * @param full Whether to include full data or minimal data
 */
export async function getOrganizationById(id: string) {
  return prisma.organization.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
}

/**
 * Get all organizations for the current user
 */
export async function getUserOrganizations() {
  const user = await requireUser();

  return prisma.organizationMember.findMany({
    where: {
      userId: user.id
    },
    include: {
      organization: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}
