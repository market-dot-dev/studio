"use server";

import { User } from '@prisma/client';
import prisma from "@/lib/prisma";
import { getSession } from '@/lib/auth';
import StripeService from './StripeService';
import ProductService from './ProductService';
import TierService, { createStripePrice } from './TierService';
import SessionService from './SessionService';

class UserService {
  static async getCurrentUser() {
    const session = await getSession();
    const userId = session?.user.id;
    if (!userId) return null;

    return UserService.findUser(userId);
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

    const result = await UserService.updateUser(userId, userData);
    //await SessionService.refreshSession();
    return result;

  }

  static async updateUser(id: string, userData: Partial<User>) {
    return prisma?.user.update({
      where: { id },
      data: userData,
    });
  }

  static async createStripeCustomer(user: User, maintainerStripeAccountId: string) {
    if(!user || !user.email) {
      throw new Error('User does not have an email address.');
    }

    if(user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    const stripeService = new StripeService(maintainerStripeAccountId);
    const customer = await stripeService.createCustomer(user.email, user.name ?? '', user.stripePaymentMethodId || undefined);
    
    await prisma?.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  }

  static async clearStripeCustomer(user: User) {
    if(!user.stripeCustomerId) {
      return;
    }

    await prisma?.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: null },
    });
  }
};

export const createStripeCustomerById = async (userId: string, stripeAccountId: string) => {
  const user = await UserService.findUser(userId);
  if(!user) {
    throw new Error('User not found.');
  }

  return await UserService.createStripeCustomer(user, stripeAccountId);
}

export const clearStripeCustomerById = async (userId: string) => {
  const user = await UserService.findUser(userId);
  if(!user) {
    throw new Error('User not found.');
  }

  return await UserService.clearStripeCustomer(user);
}

export const getStripeCustomerById = async (userId: string) => {
  const user = await UserService.findUser(userId);

  if(!user) {
    throw new Error('User not found.');
  }

  return user.stripeCustomerId;
}

export const getStripePaymentMethodIdById = async (userId: string) => {
  const user = await UserService.findUser(userId);

  if(!user) {
    throw new Error('User not found.');
  }

  return user.stripePaymentMethodId;
}

export const ensureMaintainerId = async (userId: string) => {
  return new Promise((resolve, reject) => {
    ProductService.createProduct(userId).then(() => {
      return UserService.findUser(userId).then((user) => {

        if(!user) {
          reject('User not found.');
        }

        if(!StripeService.userCanSell(user!)) {
          reject('Maintainer missing required stripe keys');
        }
        resolve(userId);
      });
    }).catch((error) => {
      reject(error);
    });
  });
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
export const { createStripeCustomer, getCurrentUser, findUser, updateCurrentUser, clearStripeCustomer } = UserService;
