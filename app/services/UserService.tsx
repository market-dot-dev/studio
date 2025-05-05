"use server";

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";
import { createSessionUser } from "../models/Session";
import SessionService from "./session-service";

class UserService {
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

  static async updateCurrentUser(userData: Prisma.UserUpdateInput) {
    const userId = await SessionService.getCurrentUserId();
    if (!userId) return null;

    const result = await UserService.updateUser(userId, userData);
    return result;
  }

  static async updateUser(id: string, userData: Prisma.UserUpdateInput) {
    return prisma?.user.update({
      where: { id },
      data: userData
    });
  }
}

export default UserService;
export const { getCurrentUser, findUser, updateCurrentUser, getCurrentSessionUser } = UserService;
