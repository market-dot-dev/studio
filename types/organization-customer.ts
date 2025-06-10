import { Prisma } from "@/app/generated/prisma";

/**
 * Prisma validator for customer organization with charges and subscriptions
 */
export const includeCustomerOrgWithChargesAndSubs =
  Prisma.validator<Prisma.OrganizationDefaultArgs>()({
    include: {
      charges: {
        include: {
          tier: true
        }
      },
      subscriptions: {
        include: {
          tier: true
        }
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });

export type CustomerOrgWithChargesAndSubs = Prisma.OrganizationGetPayload<
  typeof includeCustomerOrgWithChargesAndSubs
>;

/**
 * Prisma validator for customer organization with charges, subscriptions, and prospects
 */
export const includeCustomerOrgWithAll = Prisma.validator<Prisma.OrganizationDefaultArgs>()({
  include: {
    charges: {
      include: {
        tier: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    },
    subscriptions: {
      include: {
        tier: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    },
    prospects: {
      include: {
        tiers: true
      },
      orderBy: {
        updatedAt: "desc"
      },
      take: 5
    },
    owner: {
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    }
  }
});

export type CustomerOrgWithAll = Prisma.OrganizationGetPayload<typeof includeCustomerOrgWithAll>;
