import { Prisma } from "@/app/generated/prisma";

/**
 * Prisma validator for minimal organization data
 */
export const includeMinimalOrg = Prisma.validator<Prisma.OrganizationDefaultArgs>()({
  select: {
    id: true,
    name: true,
    type: true,
    ownerId: true,
    createdAt: true,
    updatedAt: true,
    projectName: true,
    projectDescription: true,
    stripeAccountId: true,
    stripeAccountDisabled: true
  }
});

export type MinimalOrganization = Prisma.OrganizationGetPayload<typeof includeMinimalOrg>;
