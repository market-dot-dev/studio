import { Contract, Organization, PlanType, PrismaClient, Tier, User } from "@/app/generated/prisma";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const prisma = new PrismaClient();

const loadYaml = <T>(type: string) => {
  const filePath = path.join(__dirname, `./seeds/${type}.yaml`);
  const fileContents = fs.readFileSync(filePath, "utf8");

  const parsedFile = yaml.load(fileContents) as { objects: Array<T> };
  return parsedFile.objects;
};

const createOrganizations = async (users: User[]) => {
  const createdOrganizations: Organization[] = [];

  for (const user of users) {
    // Create an organization for each user
    const organization = await prisma.organization.create({
      data: {
        name: `${user.name}'s Organization`,
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: "OWNER"
          }
        },
        // Set the organization as the user's current organization
        currentUsers: {
          connect: {
            id: user.id
          }
        },
        // Create billing record with FREE plan by default
        billing: {
          create: {
            planType: PlanType.FREE
          }
        }
        // @TODO: Seed them a site with a page too
      }
    });
    createdOrganizations.push(organization);
  }

  return createdOrganizations;
};

const loadTiers = async (organizations: Organization[]) => {
  const tiers = loadYaml<Tier>("tiers");

  for (const organization of organizations) {
    for (const tier of tiers) {
      await prisma.tier.create({
        data: {
          ...tier,
          organizationId: organization.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          revision: 1,
          trialDays: tier.trialDays || 0,
          cadence: tier.cadence || "month",
          priceAnnual: tier.priceAnnual || null
        }
      });
    }
  }
};

const loadContracts = async (organizations: Organization[]) => {
  const contracts = loadYaml<Contract>("contracts");

  for (const organization of organizations) {
    for (const contract of contracts) {
      await prisma.contract.create({
        data: {
          ...contract,
          id: `${contract.id}-${organization.id}`,
          organizationId: organization.id
        }
      });
    }
  }
};

const loadUsers = async () => {
  const users = loadYaml<User>("users");
  const createdUsers: User[] = [];

  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: {
        ...user,
        id: user.id,
        emailVerified: new Date().toISOString()
      }
    });
    createdUsers.push(createdUser);
  }

  return createdUsers;
};

async function main() {
  if (process.env.VERCEL_ENV === "production") {
    console.log("This script cannot be run on a Vercel production instance.");
    process.exit(1);
  }

  console.log("[seed] Loading users, organizations, sites, tiers and contracts...");
  console.log("[seed] * users");
  const users = await loadUsers();
  console.log("[seed] * organizations");
  const organizations = await createOrganizations(users);
  console.log("[seed] * tiers");
  await loadTiers(organizations);
  console.log("[seed] * contracts");
  await loadContracts(organizations);
  console.log("[seed] done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
