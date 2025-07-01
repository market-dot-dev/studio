"use server";

import { User } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export async function getUserById(id: string): Promise<User | undefined | null> {
  return prisma?.user.findUnique({
    where: {
      id
    }
  });
}
