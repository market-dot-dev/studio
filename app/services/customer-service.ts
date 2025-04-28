"use server";

import prisma from "@/lib/prisma";
import { Charge, Prospect, Subscription, User } from "@prisma/client";
import Customer from "../models/Customer";
import { SessionUser } from "../models/Session";
import Tier from "../models/Tier";
import SessionService from "./session-service";

/**
 * Type for customer with their charges and subscriptions
 */
type CustomerWithChargesAndSubscriptions = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
};

/**
 * Type for customer with charges, subscriptions, and prospects
 */
type CustomerWithChargesSubscriptionsAndProspects = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
  prospects: (Prospect & { tiers: Tier[] })[];
};

/**
 * Get a specific customer by maintainer and customer ID, including their charges and subscriptions
 *
 * @param maintainerId The ID of the maintainer
 * @param customerId The ID of the customer
 * @returns The customer with their charges and subscriptions, or null if not found
 */
export async function getCustomerByMaintainer(
  maintainerId: string,
  customerId: string
): Promise<CustomerWithChargesAndSubscriptions | null> {
  const customer = await prisma.user.findFirst({
    where: {
      id: customerId,
      OR: [
        {
          charges: {
            some: {
              tier: {
                userId: maintainerId
              }
            }
          }
        },
        {
          subscriptions: {
            some: {
              tier: {
                userId: maintainerId
              }
            }
          }
        }
      ]
    },
    include: {
      charges: {
        where: {
          tier: {
            userId: maintainerId
          }
        },
        include: {
          tier: true
        }
      },
      subscriptions: {
        where: {
          tier: {
            userId: maintainerId
          }
        },
        include: {
          tier: true
        }
      }
    }
  });

  return customer as CustomerWithChargesAndSubscriptions | null;
}

/**
 * Get all customers by maintainer ID, including their charges and subscriptions
 *
 * @param maintainerId The ID of the maintainer
 * @returns Array of customers with their charges and subscriptions
 */
export async function getCustomersByMaintainer(
  maintainerId: string
): Promise<CustomerWithChargesAndSubscriptions[]> {
  const customers = await prisma.user.findMany({
    where: {
      OR: [
        {
          charges: {
            some: {
              tier: {
                userId: maintainerId
              }
            }
          }
        },
        {
          subscriptions: {
            some: {
              tier: {
                userId: maintainerId
              }
            }
          }
        }
      ]
    },
    include: {
      charges: {
        where: {
          tier: {
            userId: maintainerId
          }
        },
        include: {
          tier: true
        }
      },
      subscriptions: {
        where: {
          tier: {
            userId: maintainerId
          }
        },
        include: {
          tier: true
        }
      }
    }
  });

  return customers as CustomerWithChargesAndSubscriptions[];
}

/**
 * Get all customers and prospects for a maintainer
 *
 * @param maintainerId The ID of the maintainer
 * @returns Array of customers with their charges, subscriptions, and prospects
 */
export async function getCustomersAndProspectsByMaintainer(
  maintainerId: string
): Promise<CustomerWithChargesSubscriptionsAndProspects[]> {
  const customers = await prisma.user.findMany({
    where: {
      OR: [
        {
          charges: {
            some: {
              tier: {
                userId: maintainerId
              }
            }
          }
        },
        {
          subscriptions: {
            some: {
              tier: {
                userId: maintainerId
              }
            }
          }
        },
        {
          prospects: {
            some: {
              tiers: {
                some: {
                  userId: maintainerId
                }
              }
            }
          }
        }
      ]
    },
    include: {
      charges: {
        where: {
          tier: {
            userId: maintainerId
          }
        },
        include: {
          tier: true
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 5
      },
      subscriptions: {
        where: {
          tier: {
            userId: maintainerId
          }
        },
        include: {
          tier: true
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 5
      },
      prospects: {
        where: {
          tiers: {
            some: {
              userId: maintainerId
            }
          }
        },
        include: {
          tiers: true
        },
        orderBy: {
          updatedAt: "desc"
        },
        take: 5
      }
    }
  });

  return customers as CustomerWithChargesSubscriptionsAndProspects[];
}

/**
 * Get all customers for the current maintainer
 *
 * @returns Array of customers with their charges and subscriptions
 * @throws Error if user is not found
 */
export async function getCurrentMaintainerCustomers(): Promise<
  CustomerWithChargesAndSubscriptions[]
> {
  const sessionUser = await SessionService.getSessionUser();
  if (!sessionUser) {
    throw new Error("User not found.");
  }
  return getCustomersByMaintainer(sessionUser.id);
}

/**
 * Get Stripe customer ID for a specific maintainer's account
 *
 * @param user The user to get the customer ID for
 * @param maintainerStripeAccountId The Stripe account ID of the maintainer
 * @returns The Stripe customer ID or null if not found
 */
export async function getStripeCustomerId(
  user: User | SessionUser,
  maintainerStripeAccountId: string
): Promise<string | null> {
  if (!user || !maintainerStripeAccountId) return null;

  const stripeCustomerIds = user.stripeCustomerIds as Record<string, string>;
  return stripeCustomerIds[maintainerStripeAccountId] || null;
}

/**
 * Set Stripe customer ID for a specific maintainer's account
 *
 * @param user The user to set the customer ID for
 * @param maintainerStripeAccountId The Stripe account ID of the maintainer
 * @param customerId The Stripe customer ID to set
 * @returns The updated user
 * @throws Error if required parameters are missing
 */
export async function setStripeCustomerId(
  user: User,
  maintainerStripeAccountId: string,
  customerId: string
): Promise<User> {
  if (!user || !maintainerStripeAccountId || !customerId) {
    throw new Error("Missing required parameters");
  }

  const stripeCustomerIds = { ...(user.stripeCustomerIds as Record<string, string>) };
  stripeCustomerIds[maintainerStripeAccountId] = customerId;

  return prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerIds }
  });
}

/**
 * Clear Stripe customer ID for a specific maintainer's account
 *
 * @param user The user to clear the customer ID for
 * @param maintainerStripeAccountId The Stripe account ID of the maintainer
 * @returns The updated user
 * @throws Error if required parameters are missing
 */
export async function clearStripeCustomerId(
  user: User,
  maintainerStripeAccountId: string
): Promise<User> {
  if (!user || !maintainerStripeAccountId) {
    throw new Error("Missing required parameters");
  }

  const stripeCustomerIds = { ...(user.stripeCustomerIds as Record<string, string>) };
  delete stripeCustomerIds[maintainerStripeAccountId];

  return prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerIds }
  });
}

/**
 * Clear Stripe customer ID by user ID
 *
 * @param userId The ID of the user
 * @param maintainerUserId The ID of the maintainer
 * @param maintainerStripeAccountId The Stripe account ID of the maintainer
 * @returns The updated user or null if not found
 */
export async function clearStripeCustomerIdByUserId(
  userId: string,
  maintainerUserId: string,
  maintainerStripeAccountId: string
): Promise<User | null> {
  if (!userId || !maintainerStripeAccountId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  return clearStripeCustomerId(user, maintainerStripeAccountId);
}

/**
 * Create a Stripe customer for a user
 *
 * @param userId The ID of the user
 * @param maintainerUserId The ID of the maintainer
 * @param stripeAccountId The Stripe account ID of the maintainer
 * @returns A Customer instance or null if not found
 */
export async function createStripeCustomerForUser(
  userId: string,
  maintainerUserId: string,
  stripeAccountId: string
): Promise<Customer | null> {
  if (!userId || !maintainerUserId || !stripeAccountId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const customer = new Customer(user, maintainerUserId, stripeAccountId);
  await customer.createStripeCustomer();
  return customer;
}
