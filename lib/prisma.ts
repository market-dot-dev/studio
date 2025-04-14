import { PrismaClient } from "@prisma/client";

// @TODO: Need to review this file and see if it can be replaced by a more standard implementation.
declare global {
  const prisma: PrismaClient | undefined;
}

const isDevelopment = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";
const isDevOrTest = isDevelopment || isTest;

const newPrisma = () => {
  return false && isDevOrTest
    ? new PrismaClient({ log: ["query", "info", "warn", "error"] })
    : new PrismaClient();
};

const prisma = global.prisma || newPrisma();

if (isDevOrTest) global.prisma = prisma;

export default prisma;
