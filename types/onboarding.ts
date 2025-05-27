import { Prisma } from "@/app/generated/prisma";

/**
 * Prisma validator for organization onboarding data
 */
export const includeOrganizationOnboarding = Prisma.validator<Prisma.OrganizationDefaultArgs>()({
  select: {
    id: true,
    projectName: true,
    projectDescription: true,
    businessLocation: true,
    businessType: true,
    stripeAccountId: true,
    marketExpertId: true,
    sites: {
      select: {
        id: true,
        pages: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: {
            createdAt: "asc"
          },
          take: 2
        }
      },
      orderBy: {
        createdAt: "asc"
      },
      take: 1
    },
    tiers: {
      select: {
        id: true
      },
      orderBy: {
        createdAt: "asc"
      },
      take: 1
    }
  }
});

/**
 * Organization onboarding data type
 */
export type OrganizationOnboardingData = Prisma.OrganizationGetPayload<
  typeof includeOrganizationOnboarding
>;
