"use server";

import { Charge, Prospect, Subscription, User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import TierService from "./TierService";
import SessionService from "./SessionService";
import Customer from "../models/Customer";
import { createSessionUser } from "../models/Session";
import Tier from "../models/Tier";

type CustomerWithChargesAndSubscriptions = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
};

type CustomerWithChargesSubscriptionsAndProspects = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
  prospects: (Prospect & { tiers: Tier[] })[];
};

class UserService {
  static filterUserAttributes(user: User | Partial<User>) {
    const attrs: Partial<User> = { ...user };

    delete attrs.roleId;

    return attrs;
  }

  static async getCurrentUser() {
    const session = await getSession();
    const userId = session?.user.id;
    if (!userId) return null;

    return UserService.findUser(userId);
  }

  static async getCurrentSessionUser() {
    const currentUser = await getCurrentUser();
    return currentUser ? createSessionUser(currentUser) : null;
  }

  static async findUser(id: string): Promise<User | undefined | null> {
    return prisma?.user.findUnique({
      where: {
        id,
      },
    });
  }

  static async getCustomersMaintainers(): Promise<Partial<User>[]> {
    // if current user is admin
    const session = await getSession();
    if (session?.user.roleId !== "admin") {
      return [];
    }

    // find users where roleId is either customer or maintainer
    return prisma?.user.findMany({
      where: {
        roleId: {
          in: ["customer", "maintainer", "admin"],
        },
      },
      select: {
        id: true,
        gh_username: true,
        email: true,
        name: true,
        roleId: true,
      },
    });
  }

  static async findUserByGithubId(
    gh_username: string,
  ): Promise<User | undefined | null> {
    return prisma?.user.findFirst({
      where: {
        gh_username,
      },
    });
  }

  static async customerOfMaintainer(
    maintainerId: string,
    userId: string,
  ): Promise<CustomerWithChargesAndSubscriptions | null> {
    const customer = await prisma.user.findFirst({
      where: {
        id: userId,
        OR: [
          {
            charges: {
              some: {
                tier: {
                  userId: maintainerId,
                },
              },
            },
          },
          {
            subscriptions: {
              some: {
                tier: {
                  userId: maintainerId,
                },
              },
            },
          },
        ],
      },
      include: {
        charges: {
          where: {
            tier: {
              userId: maintainerId,
            },
          },
          include: {
            tier: true,
          },
        },
        subscriptions: {
          where: {
            tier: {
              userId: maintainerId,
            },
          },
          include: {
            tier: true,
          },
        },
      },
    });

    return customer as CustomerWithChargesAndSubscriptions | null;
  }

  static async customersOfMaintainer(
    maintainerId: string,
  ): Promise<CustomerWithChargesAndSubscriptions[]> {
    const customers = await prisma.user.findMany({
      where: {
        OR: [
          {
            charges: {
              some: {
                tier: {
                  userId: maintainerId,
                },
              },
            },
          },
          {
            subscriptions: {
              some: {
                tier: {
                  userId: maintainerId,
                },
              },
            },
          },
        ],
      },
      include: {
        charges: {
          where: {
            tier: {
              userId: maintainerId,
            },
          },
          include: {
            tier: true,
          },
        },
        subscriptions: {
          where: {
            tier: {
              userId: maintainerId,
            },
          },
          include: {
            tier: true,
          },
        },
      },
    });

    return customers as CustomerWithChargesAndSubscriptions[];
  }

  static async customersAndProspectsOfMaintainer(
    maintainerId: string,
  ): Promise<CustomerWithChargesSubscriptionsAndProspects[]> {
    const customers = await prisma.user.findMany({
      where: {
        OR: [
          {
            charges: {
              some: {
                tier: {
                  userId: maintainerId,
                },
              },
            },
          },
          {
            subscriptions: {
              some: {
                tier: {
                  userId: maintainerId,
                },
              },
            },
          },
          {
            prospects: {
              some: {
                tiers: {
                  some: {
                    userId: maintainerId,
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        charges: {
          where: {
            tier: {
              userId: maintainerId,
            },
          },
          include: {
            tier: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        subscriptions: {
          where: {
            tier: {
              userId: maintainerId,
            },
          },
          include: {
            tier: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        prospects: {
          where: {
            tiers: {
              some: {
                userId: maintainerId,
              },
            },
          },
          include: {
            tiers: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
          take: 5,
        },
      },
    });

    return customers as CustomerWithChargesSubscriptionsAndProspects[];
  }

  static async updateCurrentUser(userData: Partial<User>) {
    const userId = await SessionService.getCurrentUserId();
    if (!userId) return null;

    const attrs = UserService.filterUserAttributes(userData);

    const result = await UserService.updateUser(userId, attrs);
    return result;
  }

  static async updateUser(id: string, userData: any) {
    return prisma?.user.update({
      where: { id },
      data: userData,
    });
  }

  static async getCustomerId(user: User, maintainerStripeAccountId: string) {
    const lookup = user.stripeCustomerIds as Record<string, string>;
    return lookup[maintainerStripeAccountId];
  }

  static async setCustomerId(
    user: User,
    maintainerStripeAccountId: string,
    customerId: string,
  ) {
    const lookup = user.stripeCustomerIds as Record<string, string>;
    lookup[maintainerStripeAccountId] = customerId;

    await prisma?.user.update({
      where: { id: user.id },
      data: { stripeCustomerIds: lookup },
    });
  }

  static async clearCustomerId(user: User, maintainerStripeAccountId: string) {
    const lookup = user.stripeCustomerIds as Record<string, string>;
    delete lookup[maintainerStripeAccountId];

    await prisma?.user.update({
      where: { id: user.id },
      data: { stripeCustomerIds: lookup },
    });
  }
}

export const clearStripeCustomerById = async (
  userId: string,
  maintainerUserId: string,
  maintainerStripeAccountId: string,
) => {
  const user = await UserService.findUser(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  const customer = new Customer(
    user,
    maintainerUserId,
    maintainerStripeAccountId,
  );
  return await customer.destroyCustomer();
};

export const createStripeCustomerById = async (
  userId: string,
  maintainerUserId: string,
  stripeAccountId: string,
) => {
  const user = await UserService.findUser(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  const customer = new Customer(user, maintainerUserId, maintainerUserId);
  return await customer.createStripeCustomer();
};

export const ensureTierId = async (tierId: string) => {
  return new Promise((resolve, reject) => {
    TierService.findTier(tierId)
      .then((tier) => {
        if (!tier) {
          return reject("Tier not found.");
        }

        if (!tier.stripePriceId) {
          return reject("Tier missing required stripe keys");
        }
        resolve(tierId);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const customersOfMaintainer = async (
  maintainerId: string,
): Promise<CustomerWithChargesAndSubscriptions[]> => {
  return UserService.customersOfMaintainer(maintainerId);
};

export const customers = async (): Promise<
  CustomerWithChargesAndSubscriptions[]
> => {
  const sessionUser = await SessionService.getSessionUser();
  if (!sessionUser) {
    throw new Error("User not found.");
  }
  return UserService.customersOfMaintainer(sessionUser.id);
};

export default UserService;
export const {
  getCurrentUser,
  findUser,
  updateCurrentUser,
  getCurrentSessionUser,
  customersAndProspectsOfMaintainer,
} = UserService;
