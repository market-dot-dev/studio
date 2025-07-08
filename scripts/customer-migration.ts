import { OrganizationType, PrismaClient } from "@/app/generated/prisma";
import { JsonValue } from "@/app/generated/prisma/runtime/library";
import { InputJsonValue } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

// Interface for tracking migration changes
interface MigrationStats {
  orgsToProcess: number;
  customerProfilesCreated: number;
  chargesUpdated: number;
  subscriptionsUpdated: number;
  orgsMarkedAsMigrated: number;
  errors: Array<{ orgId: string; error: string }>;
}

// Global statistics tracking
const stats: MigrationStats = {
  orgsToProcess: 0,
  customerProfilesCreated: 0,
  chargesUpdated: 0,
  subscriptionsUpdated: 0,
  orgsMarkedAsMigrated: 0,
  errors: []
};

async function main() {
  console.log("Starting CustomerProfile migration...");

  // Get all organizations that are of type CUSTOMER
  const customerOrgs = await prisma.organization.findMany({
    where: { type: OrganizationType.CUSTOMER }
  });

  stats.orgsToProcess = customerOrgs.length;
  if (stats.orgsToProcess === 0) {
    console.log("No CUSTOMER organizations found to migrate. Exiting. ✅");
    return;
  }

  console.log(`Found ${stats.orgsToProcess} CUSTOMER organizations to process.`);

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
  console.log(`Organizations processed: ${stats.orgsToProcess}`);
  console.log(`Customer Profiles created: ${stats.customerProfilesCreated}`);
  console.log(`Charges updated: ${stats.chargesUpdated}`);
  console.log(`Subscriptions updated: ${stats.subscriptionsUpdated}`);
  console.log(`Organizations marked as migrated: ${stats.orgsMarkedAsMigrated}`);
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

  // Use a transaction to ensure all or nothing for this org's migration
  await prisma.$transaction(async (tx) => {
    // 1. Check if a CustomerProfile already exists for the owner.
    const existingProfile = await tx.customerProfile.findUnique({
      where: { userId: org.ownerId }
    });

    if (existingProfile) {
      console.warn(
        `  - WARNING: User ${org.ownerId} already has a CustomerProfile. Skipping profile creation.`
      );
      // If you decide to merge data, the logic would go here. For now, we skip.
      return;
    }

    // 2. Create a new CustomerProfile for the organization's owner.
    const newProfile = await tx.customerProfile.create({
      data: {
        userId: org.ownerId,
        stripeCustomerIds: org.stripeCustomerIds as InputJsonValue,
        stripePaymentMethodIds: org.stripePaymentMethodIds as InputJsonValue
      }
    });
    stats.customerProfilesCreated++;
    console.log(`  - Created CustomerProfile ${newProfile.id} for User ${org.ownerId}.`);

    // 3. Update all Charges related to this org to point to the new CustomerProfile.
    const chargesUpdate = await tx.charge.updateMany({
      where: { organizationId: org.id },
      data: { customerProfileId: newProfile.id }
    });
    if (chargesUpdate.count > 0) {
      stats.chargesUpdated += chargesUpdate.count;
      console.log(`  - Re-linked ${chargesUpdate.count} charges.`);
    }

    // 4. Update all Subscriptions related to this org to point to the new CustomerProfile.
    const subscriptionsUpdate = await tx.subscription.updateMany({
      where: { organizationId: org.id },
      data: { customerProfileId: newProfile.id }
    });
    if (subscriptionsUpdate.count > 0) {
      stats.subscriptionsUpdated += subscriptionsUpdate.count;
      console.log(`  - Re-linked ${subscriptionsUpdate.count} subscriptions.`);
    }

    // 5. Mark the old organization as migrated to prevent re-processing and to identify it for later cleanup.
    // A name change is a simple, visible way to do this without schema changes.
    await tx.organization.update({
      where: { id: org.id },
      data: {
        name: `[MIGRATED] ${org.name}`
      }
    });
    stats.orgsMarkedAsMigrated++;
    console.log(`  - Marked organization ${org.id} as migrated.`);
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
