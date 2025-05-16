import { OrganizationRole, OrganizationType, PrismaClient, User } from "@/app/generated/prisma";

const prisma = new PrismaClient();

// Interface for tracking migration changes
interface MigrationStats {
  users: number;
  orgsCreated: number;
  tiers: number;
  contracts: number;
  charges: number;
  subscriptions: number;
  leads: number;
  prospects: number;
  sites: number;
  pages: number;
  errors: Array<{ userId: string; error: string }>;
}

// Global statistics tracking
const stats: MigrationStats = {
  users: 0,
  orgsCreated: 0,
  tiers: 0,
  contracts: 0,
  charges: 0,
  subscriptions: 0,
  leads: 0,
  prospects: 0,
  sites: 0,
  pages: 0,
  errors: []
};

async function main() {
  console.log("Starting organization migration...");

  // Process users in batches to avoid memory issues with large datasets
  const batchSize = 100;
  let skip = 0;
  let usersProcessed = 0;
  const totalUsers = await prisma.user.count();

  console.log(`Found ${totalUsers} users to process`);

  while (usersProcessed < totalUsers) {
    // Get a batch of users
    const users = await prisma.user.findMany({
      skip,
      take: batchSize,
      include: {
        ownedOrganizations: true
      }
    });

    console.log(
      `Processing batch of ${users.length} users (${usersProcessed + 1} to ${usersProcessed + users.length} of ${totalUsers})`
    );

    // Process each user in the batch
    for (const user of users) {
      try {
        await processUser(user);
        usersProcessed++;
        stats.users++;

        if (usersProcessed % 10 === 0) {
          console.log(`Processed ${usersProcessed} of ${totalUsers} users`);
        }
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        stats.errors.push({ userId: user.id, error: error.toString() });
      }
    }

    skip += batchSize;
  }

  // Print final statistics
  console.log("\n==== Migration Summary ====");
  console.log(`Users processed: ${stats.users}`);
  console.log(`Organizations created: ${stats.orgsCreated}`);
  console.log(`Tiers updated: ${stats.tiers}`);
  console.log(`Contracts updated: ${stats.contracts}`);
  console.log(`Charges updated: ${stats.charges}`);
  console.log(`Subscriptions updated: ${stats.subscriptions}`);
  console.log(`Leads updated: ${stats.leads}`);
  console.log(`Prospects updated: ${stats.prospects}`);
  console.log(`Sites updated: ${stats.sites}`);
  console.log(`Pages updated: ${stats.pages}`);
  console.log(`Errors encountered: ${stats.errors.length}`);

  if (stats.errors.length > 0) {
    console.log("Error details:");
    stats.errors.forEach((err) => {
      console.log(`- User ${err.userId}: ${err.error}`);
    });
  }
  console.log(" ");
  console.log("Migration complete. ✅");
}

async function processUser(user: User & { ownedOrganizations: any[] }) {
  // Skip if user already has an organization
  if (user.ownedOrganizations.length > 0) {
    console.log(`User ${user.id} already has organization(s), skipping creation`);
    return;
  }

  // Determine organization type based on user's role
  let orgType: OrganizationType = OrganizationType.BILLING;
  if (user.roleId !== "customer") {
    orgType = OrganizationType.VENDOR;
  }

  try {
    // Create organization for user with business/payment fields migrated from user
    const organization = await prisma.organization.create({
      data: {
        name: "Organization: " + user.name || user.username || user.email || user.id,
        type: orgType,

        // Migrate business fields
        businessLocation: user.businessLocation,
        businessType: user.businessType,
        company: user.company,
        projectName: user.projectName,
        projectDescription: user.projectDescription,
        marketExpertId: user.marketExpertId,
        gh_id: user.gh_id,
        gh_username: user.gh_username,

        // Migrate Stripe fields
        stripeCustomerIds: user.stripeCustomerIds ?? undefined, // Already a JSON field in both models
        stripePaymentMethodIds: user.stripePaymentMethodIds ?? undefined, // Already a JSON field in both models
        stripeAccountId: user.stripeAccountId,
        stripeCSRF: user.stripeCSRF,
        stripeAccountDisabled: user.stripeAccountDisabled,
        stripeAccountDisabledReason: user.stripeAccountDisabledReason,

        // Owner relationship
        owner: {
          connect: { id: user.id }
        },

        // Add user as member with OWNER role
        members: {
          create: {
            userId: user.id,
            role: OrganizationRole.OWNER
          }
        }
      }
    });

    console.log(`Created organization ${organization.id} for user ${user.id}`);
    stats.orgsCreated++;

    // Set as current organization for user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentOrganizationId: organization.id
      }
    });

    // Update all related entities to include organization reference
    await migrateUserEntities(user.id, organization.id);
  } catch (error) {
    console.error(`Error creating organization for user ${user.id}:`, error);
    stats.errors.push({ userId: user.id, error: error.toString() });
    throw error; // Re-throw to be caught by the main error handler
  }
}

async function migrateUserEntities(userId: string, organizationId: string) {
  try {
    // Wrap all entity updates in a single transaction for atomicity
    const results = await prisma.$transaction(async (tx) => {
      // Store the counts to return from the transaction
      const counts = {
        tiers: 0,
        contracts: 0,
        charges: 0,
        subscriptions: 0,
        leads: 0,
        prospects: 0,
        sites: 0,
        pages: 0
      };

      // Migrate Tiers
      const tiersResult = await tx.tier.updateMany({
        where: { userId },
        data: { organizationId }
      });
      counts.tiers = tiersResult.count;

      // Migrate Contracts
      const contractsResult = await tx.contract.updateMany({
        where: { maintainerId: userId },
        data: { organizationId }
      });
      counts.contracts = contractsResult.count;

      // Migrate Charges
      const chargesResult = await tx.charge.updateMany({
        where: { userId },
        data: { organizationId }
      });
      counts.charges = chargesResult.count;

      // Migrate Subscriptions
      const subscriptionsResult = await tx.subscription.updateMany({
        where: { userId },
        data: { organizationId }
      });
      counts.subscriptions = subscriptionsResult.count;

      // Migrate Leads
      const leadsResult = await tx.lead.updateMany({
        where: { userId },
        data: { organizationId }
      });
      counts.leads = leadsResult.count;

      // Migrate Prospects
      const prospectsResult = await tx.prospect.updateMany({
        where: { userId },
        data: { organizationId }
      });
      counts.prospects = prospectsResult.count;

      // Migrate Sites
      const sitesResult = await tx.site.updateMany({
        where: { userId },
        data: { organizationId }
      });
      counts.sites = sitesResult.count;

      // Migrate Pages
      const pagesResult = await tx.page.updateMany({
        where: { userId },
        data: { organizationId }
      });
      counts.pages = pagesResult.count;

      return counts;
    });

    // Update statistics with transaction results
    stats.tiers += results.tiers;
    stats.contracts += results.contracts;
    stats.charges += results.charges;
    stats.subscriptions += results.subscriptions;
    stats.leads += results.leads;
    stats.prospects += results.prospects;
    stats.sites += results.sites;
    stats.pages += results.pages;

    // Log results
    console.log(`Transaction complete for user ${userId}:`);
    console.log(`- Updated ${results.tiers} tiers`);
    console.log(`- Updated ${results.contracts} contracts`);
    console.log(`- Updated ${results.charges} charges`);
    console.log(`- Updated ${results.subscriptions} subscriptions`);
    console.log(`- Updated ${results.leads} leads`);
    console.log(`- Updated ${results.prospects} prospects`);
    console.log(`- Updated ${results.sites} sites`);
    console.log(`- Updated ${results.pages} pages`);
  } catch (error) {
    console.error(`Transaction failed for user ${userId}:`, error);
    stats.errors.push({ userId, error: `Transaction failed: ${error.toString()}` });
    throw error;
  }
}

// Run the migration
main()
  .catch((e) => {
    console.error("Error in migration:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
