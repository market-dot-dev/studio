import { Contract, Feature, PrismaClient, Tier, User } from "@prisma/client";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import RegistrationService from "@/app/services/registration-service";

const prisma = new PrismaClient();

const loadYaml = <T>(type: string) => {
  const filePath = path.join(__dirname, `./seeds/${type}.yaml`);
  const fileContents = fs.readFileSync(filePath, "utf8");

  const parsedFile = yaml.load(fileContents) as { objects: Array<T> };
  return parsedFile.objects;
};

async function main() {
  if (process.env.VERCEL_ENV === "production") {
    console.log("This script cannot be run on a Vercel production instance.");
    process.exit(1);
  }

  console.log("[seed] Loading users, tiers, and features...");
  console.log("[seed] * users");
  const users = await loadUsers();
  console.log("[seed] * sites");
  users.forEach((user) => RegistrationService.createSite(user));
  console.log("[seed] * tiers");
  await loadTiers(users);
  console.log("[seed] * features");
  await loadFeatures(users);
  console.log("[seed] * contracts");
  await loadContracts(users);
  console.log("[seed] done");
}

const loadUsers = async () => {
  const users = loadYaml<User>("users");
  const createdUsers: User[] = [];

  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: {
        ...user,
        id: user.id,
        stripeCustomerIds: {},
        stripePaymentMethodIds: {},
        emailVerified: new Date().toISOString(),
        roleId: "admin",
        company: user.company || "market.dev",
      },
    });
    createdUsers.push(createdUser);
  }

  return createdUsers;
};

const loadTiers = async (users: User[]) => {
  const tiers = loadYaml<Tier>("tiers");

  for (const user of users) {
    for (const tier of tiers) {
      await prisma.tier.create({
        data: {
          ...tier,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          revision: 1,
          applicationFeePercent: tier.applicationFeePercent || 0,
          applicationFeePrice: tier.applicationFeePrice || 0,
          trialDays: tier.trialDays || 0,
          cadence: tier.cadence || "month",
          priceAnnual: tier.priceAnnual || null,
        },
      });
    }
  }
};

const loadFeatures = async (users: User[]) => {
  const features = loadYaml<Feature>("features");

  for (const user of users) {
    for (const feature of features) {
      await prisma.feature.create({
        data: {
          ...feature,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          isEnabled: feature.isEnabled || false,
        },
      });
    }
  }
};

const loadContracts = async (users: User[]) => {
  const contracts = loadYaml<Contract>("contracts");

  for (const user of users) {
    for (const contract of contracts) {
      await prisma.contract.create({
        data: {
          ...contract,
          id: `${contract.id}-${user.id}`,
          maintainerId: user.id,
        },
      });
    }
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
