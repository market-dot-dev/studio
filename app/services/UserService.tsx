"use server";

import { Prisma, User } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { requireUserSession } from "./user-context-service";

class UserService {
  static async findUser(id: string): Promise<User | undefined | null> {
    return prisma?.user.findUnique({
      where: {
        id
      }
    });
  }

  static async updateCurrentUser(userData: Prisma.UserUpdateInput) {
    const user = await requireUserSession();
    const result = await UserService.updateUser(user.id, userData);
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
export const { findUser, updateCurrentUser } = UserService;
