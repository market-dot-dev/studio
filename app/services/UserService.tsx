"use server";

import { User } from '@prisma/client';
import prisma from "@/lib/prisma";
import { getSession } from '@/lib/auth';
import StripeService from './StripeService';

class UserService {
  static async getCurrentUserId() {
    const session = await getSession();

    return session?.user.id;
  }

  static async getCurrentUser() {
    const session = await getSession();
    const userId = session?.user.id;
    if (!userId) return null;

    return UserService.findUser(session.user.id);
  }

  static async findCurrentUser(): Promise<User | undefined | null> {
    const session = await getSession();
    return prisma?.user.findUnique({
      where: {
        email: session?.user?.email || '',
      },
    });
  }

  static async findUser(id: string): Promise<User | undefined | null> {
    return prisma?.user.findUnique({
      where: {
        id,
      },
    });
  }

  static async updateUser(id: string, userData: Partial<User>) {
    return prisma?.user.update({
      where: { id },
      data: userData,
    });
  }

  static async createStripeCustomer(user: User) {
    if(!user || !user.email) {
      throw new Error('User does not have an email address.');
    }

    const customer = await StripeService.createCustomer(user.email, user.stripePaymentMethodId || undefined);
    
    await prisma?.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
  }
};

export const createStripeCustomerById = async (userId: string) => {
  const user = await UserService.findUser(userId);
  if(!user) {
    throw new Error('User not found.');
  }

  await UserService.createStripeCustomer(user);
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

export default UserService;
export const { createStripeCustomer, getCurrentUserId, getCurrentUser, findCurrentUser, findUser } = UserService;
