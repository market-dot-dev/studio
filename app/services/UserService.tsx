"use server";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { createSessionUser } from "../models/Session";
import SessionService from "./SessionService";

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
        id
      }
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
          in: ["customer", "maintainer", "admin"]
        }
      },
      select: {
        id: true,
        gh_username: true,
        email: true,
        name: true,
        roleId: true,
        createdAt: true,
        updatedAt: true,
        company: true,
        businessType: true,
        businessLocation: true
      }
    });
  }

  static async findUserByGithubId(gh_username: string): Promise<User | undefined | null> {
    return prisma?.user.findFirst({
      where: {
        gh_username
      }
    });
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
      data: userData
    });
  }
}

export default UserService;
export const { getCurrentUser, findUser, updateCurrentUser, getCurrentSessionUser } = UserService;
