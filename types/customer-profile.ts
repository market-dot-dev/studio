import { Prisma } from "@/app/generated/prisma";

/**
 * Prisma validator for customer profile with charges and subscriptions
 */
export const includeCustomerProfileWithChargesAndSubs =
  Prisma.validator<Prisma.CustomerProfileDefaultArgs>()({
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });

export type CustomerProfileWithChargesAndSubs = Prisma.CustomerProfileGetPayload<
  typeof includeCustomerProfileWithChargesAndSubs
>;

/**
 * Prisma validator for customer profile with charges, subscriptions, and basic user info
 */
export const includeCustomerProfileWithAll = Prisma.validator<Prisma.CustomerProfileDefaultArgs>()({
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
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    }
  }
});

export type CustomerProfileWithAll = Prisma.CustomerProfileGetPayload<
  typeof includeCustomerProfileWithAll
>;

/**
 * Basic customer profile for checkout operations
 */
export const includeCustomerProfileForCheckout =
  Prisma.validator<Prisma.CustomerProfileDefaultArgs>()({
    select: {
      id: true,
      userId: true,
      stripeCustomerIds: true,
      stripePaymentMethodIds: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

export type CustomerProfileForCheckout = Prisma.CustomerProfileGetPayload<
  typeof includeCustomerProfileForCheckout
>;
