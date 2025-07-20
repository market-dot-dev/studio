import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting cleanup of migrated CUSTOMER organizations...");

  const migrationMarker = "[MIGRATED";

  // Find all organizations that have been marked as migrated
  const migratedOrgs = await prisma.organization.findMany({
    where: {
      name: {
        startsWith: migrationMarker
      }
    },
    select: {
      id: true,
      name: true
    }
  });

  const orgCount = migratedOrgs.length;

  if (orgCount === 0) {
    console.log("No migrated organizations found to clean up. Exiting. ✅");
    return;
  }

  console.log(`Found ${orgCount} organizations marked for deletion:`);
  migratedOrgs.forEach((org) => console.log(`  - ID: ${org.id}, Name: ${org.name}`));

  // Safety Check: Require a '--force' flag to actually delete
  const forceFlag = process.argv.includes("--force");

  if (!forceFlag) {
    console.log("\nThis is a destructive action.");
    console.log("Run the script with the --force flag to proceed with deletion.");
    console.log("Example: `npx ts-node path/to/cleanup-migrated-orgs.ts --force`");
    return;
  }

  console.log("\n--force flag detected. Proceeding with deletion...");

  try {
    const deleteResult = await prisma.organization.deleteMany({
      where: {
        id: {
          in: migratedOrgs.map((org) => org.id)
        }
      }
    });

    console.log(`\nSuccessfully deleted ${deleteResult.count} organizations. ✅`);
  } catch (error) {
    console.error("\nAn error occurred during deletion:", error);
    console.error(
      "Deletion failed. The migrated organizations have not been removed. Please investigate the error."
    );
    process.exit(1);
  }
}

// Run the cleanup script
main()
  .catch((e) => {
    console.error("A critical error occurred during the cleanup process:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
