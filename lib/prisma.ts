import { PrismaClient } from "@prisma/client";
import "server-only";

// Define the type for the global object to store the Prisma instance
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a new Prisma instance with appropriate logging settings
function createPrismaClient() {
  const isDev = process.env.NODE_ENV === "development";
  const isTest = process.env.NODE_ENV === "test";

  // Only enable detailed logging in development/test environments
  if (isDev || isTest) {
    return new PrismaClient({
      log: ["query", "info", "warn", "error"]
    });
  }

  return new PrismaClient();
}

// Use existing instance if available to prevent multiple instances during hot reloading
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Only save the instance in development to prevent memory leaks in production
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
