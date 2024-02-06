import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const isDevelopment = process.env.NODE_ENV === "development";

const prismaInstance = isDevelopment ? new PrismaClient({ log: ['query', 'info', 'warn', 'error'] }) : new PrismaClient();

const prisma = global.prisma || prismaInstance;

if (isDevelopment) global.prisma = prisma;

export default prisma;
