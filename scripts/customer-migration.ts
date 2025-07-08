import { OrganizationType, PrismaClient } from "@/app/generated/prisma";
import { InputJsonValue } from "@/app/generated/prisma/runtime/library";
import { JsonValue } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

// Interface for tracking migration changes
interface MigrationStats {
  customerOrgsFound: number;
  profilesCreated: number;
  chargesUpdated: number;
  subscriptionsUpdated: number;
  orgsMarkedForCleanup: number;
  errors: Array<{ orgId: string; error: string }>;
}

// Global statistics tracking
const stats: MigrationStats = {
  customerOrgsFound: 0,
  profilesCreated: 0,
  chargesUpdated: 0,
  subscriptionsUpdated: 0,
  orgsMarkedForCleanup: 0,
  errors: []
};

async function main() {
  console.log("Starting CustomerProfile migration...");

  // Get all organizations that are of type CUSTOMER
  const customerOrgs = await prisma.organization.findMany({
    where: { type: OrganizationType.CUSTOMER }
  });

  stats.customerOrgsFound = customerOrgs.length;
  if (stats.customerOrgsFound === 0) {
    console.log("No CUSTOMER organizations found to migrate. Exiting. ✅");
    return;
  }

  console.log(`Found ${stats.customerOrgsFound} CUSTOMER organizations to process.`);

  // Process each customer organization
  for (const org of customerOrgs) {
    try {
      await processCustomerOrg(org);
    } catch (error: unknown) {
      const errMsg = `Failed to process organization ${org.id}:`;
      console.error(errMsg, error);
      stats.errors.push({
        orgId: org.id,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Print final statistics
  console.log("\n==== Migration Summary ====");
  console.log(`Organizations processed: ${stats.customerOrgsFound}`);
  console.log(`Customer Profiles created: ${stats.profilesCreated}`);
  console.log(`Charges updated: ${stats.chargesUpdated}`);
  console.log(`Subscriptions updated: ${stats.subscriptionsUpdated}`);
  console.log(`Organizations marked for cleanup: ${stats.orgsMarkedForCleanup}`);
  console.log(`Errors encountered: ${stats.errors.length}`);

  if (stats.errors.length > 0) {
    console.log("\nError details:");
    stats.errors.forEach((err) => {
      console.log(`- Org ${err.orgId}: ${err.error}`);
    });
  }
  console.log("\nMigration complete. ✅");
}

async function processCustomerOrg(org: {
  id: string;
  ownerId: string;
  name: string;
  stripeCustomerIds: JsonValue;
  stripePaymentMethodIds: JsonValue;
}) {
  console.log(`\nProcessing organization ${org.id} (Owner: ${org.ownerId})...`);

  await prisma.$transaction(async (tx) => {
    // Since we've proven a user can't own multiple CUSTOMER orgs, we can safely check for an existing profile.
    // This makes the script re-runnable without creating duplicate profiles.
    const existingProfile = await tx.customerProfile.findUnique({
      where: { userId: org.ownerId }
    });

    if (existingProfile) {
      console.log(
        `  - User ${org.ownerId} already has a CustomerProfile. Skipping profile creation.`
      );
      // In a simple 1-to-1 scenario, we assume if the profile exists, the data is already migrated.
      // We'll just mark the org for cleanup and exit this transaction.
      await tx.organization.update({
        where: { id: org.id },
        data: { name: `[MIGRATED-DUPE] ${org.name}` }
      });
      return;
    }

    // 1. Create a new CustomerProfile for the organization's owner.
    const newProfile = await tx.customerProfile.create({
      data: {
        userId: org.ownerId,
        stripeCustomerIds: org.stripeCustomerIds as InputJsonValue,
        stripePaymentMethodIds: org.stripePaymentMethodIds as InputJsonValue
      }
    });
    stats.profilesCreated++;
    console.log(`  - Created CustomerProfile ${newProfile.id} for User ${org.ownerId}.`);

    // 2. Update all Charges related to this org to point to the new CustomerProfile.
    const chargesUpdate = await tx.charge.updateMany({
      where: { organizationId: org.id },
      data: { customerProfileId: newProfile.id }
    });
    if (chargesUpdate.count > 0) {
      stats.chargesUpdated += chargesUpdate.count;
      console.log(`  - Re-linked ${chargesUpdate.count} charges.`);
    }

    // 3. Update all Subscriptions related to this org to point to the new CustomerProfile.
    const subscriptionsUpdate = await tx.subscription.updateMany({
      where: { organizationId: org.id },
      data: { customerProfileId: newProfile.id }
    });
    if (subscriptionsUpdate.count > 0) {
      stats.subscriptionsUpdated += subscriptionsUpdate.count;
      console.log(`  - Re-linked ${subscriptionsUpdate.count} subscriptions.`);
    }

    // 4. Mark the old organization for cleanup.
    await tx.organization.update({
      where: { id: org.id },
      data: {
        name: `[MIGRATED] ${org.name}`
      }
    });
    stats.orgsMarkedForCleanup++;
    console.log(`  - Marked organization ${org.id} for cleanup.`);
  });
}

// Run the migration
main()
  .catch((e) => {
    console.error("A critical error occurred during the migration process:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
