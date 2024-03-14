import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const isDevelopment = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";
const isDevOrTest = isDevelopment || isTest;

const newPrisma = () => {
  return isDevOrTest ?
    new PrismaClient({ log: ['query', 'info', 'warn', 'error'] }) :
    new PrismaClient();
}

const prisma = global.prisma || newPrisma();

if (isDevOrTest) global.prisma = prisma;

export default prisma;
