"use server";

import { User } from '@prisma/client';
import prisma from "@/lib/prisma";
import { getSession } from '@/lib/auth';
import TierService from './TierService';
import SessionService from './SessionService';
import Customer from '../models/Customer';
import { createSessionUser } from '../models/Session';

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

  static async updateCurrentUser(userData: Partial<User>) {
    const userId = await SessionService.getCurrentUserId()
    if(!userId) return null;

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

  static async getCustomerId(user: User, maintainerUserId: string) {
    const lookup = user.stripeCustomerIds as Record<string, string>;
    return lookup[maintainerUserId];
  }

  static async setCustomerId(user: User, maintainerUserId: string, customerId: string) {
    const lookup = user.stripeCustomerIds as Record<string, string>;
    lookup[maintainerUserId] = customerId;

    await prisma?.user.update({
      where: { id: user.id },
      data: { stripeCustomerIds: lookup },
    });
  }

  static async clearCustomerId(user: User, maintainerUserId: string) {
    const lookup = user.stripeCustomerIds as Record<string, string>;
    delete lookup[maintainerUserId];

    await prisma?.user.update({
      where: { id: user.id },
      data: { stripeCustomerIds: lookup },
    });
  }
}

export const clearStripeCustomerById = async (userId: string, maintainerUserId: string) => {
  const user = await UserService.findUser(userId);
  if(!user) {
    throw new Error('User not found.');
  }

  const customer = new Customer(user, maintainerUserId, maintainerUserId);
  return await customer.destroyCustomer();
}

export const createStripeCustomerById = async (userId: string, maintainerUserId: string, stripeAccountId: string) => {
  
  const user = await UserService.findUser(userId);
  if(!user) {
    throw new Error('User not found.');
  }

  const customer = new Customer(user, maintainerUserId, maintainerUserId);
  return await customer.createStripeCustomer();
}

export const ensureTierId = async (tierId: string) => {
  return new Promise((resolve, reject) => {
    TierService.findTier(tierId).then((tier) => {
      if(!tier) {
        return reject('Tier not found.');
      }

      if(!tier.stripePriceId) {
        return reject('Tier missing required stripe keys');
      }
      resolve(tierId);
    }).catch((error) => {
      reject(error);
    });
  });
}

export default UserService;
export const { getCurrentUser, findUser, updateCurrentUser, getCurrentSessionUser } = UserService;
