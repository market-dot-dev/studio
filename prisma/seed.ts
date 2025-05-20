import {
  Contract,
  Organization,
  OrganizationType,
  PrismaClient,
  Tier,
  User
} from "@/app/generated/prisma";
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

const loadUsers = async () => {
  const users = loadYaml<User>("users");
  const createdUsers: User[] = [];

  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: {
        ...user,
        id: user.id,
        stripeCustomerIds: {}, // @DEPRECATED, but still required for now
        stripePaymentMethodIds: {}, // @DEPRECATED, but still required for now
        emailVerified: new Date().toISOString(),
        roleId: "admin" // @DEPRECATED, but still required for now
      }
    });
    createdUsers.push(createdUser);
  }

  return createdUsers;
};

const createOrganizations = async (users: User[]) => {
  const createdOrganizations: Organization[] = [];

  for (const user of users) {
    // Create an organization for each user
    const organization = await prisma.organization.create({
      data: {
        name: user.company || `${user.name}'s Organization`,
        type: OrganizationType.VENDOR,
        ownerId: user.id,
        company: user.company || "market.dev",
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
        stripeCustomerIds: {},
        stripePaymentMethodIds: {},
        marketExpertId: user.marketExpertId
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
          userId: organization.ownerId, // @DEPRECATED - still required for now
          organizationId: organization.id, // New connection to organization
          createdAt: new Date(),
          updatedAt: new Date(),
          revision: 1,
          applicationFeePercent: tier.applicationFeePercent || 0,
          applicationFeePrice: tier.applicationFeePrice || 0,
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
