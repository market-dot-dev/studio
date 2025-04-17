import { Contract, PrismaClient } from "@prisma/client";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const prisma = new PrismaClient();

const syncContracts = async () => {
  const yamlFile = path.join(__dirname, "./sync/contracts.yaml");
  const fileContents = fs.readFileSync(yamlFile, "utf8");
  const data = yaml.load(fileContents) as { contracts: Array<Contract> };

  // Retrieve all current contracts in the database.
  const existingContracts = await prisma.contract.findMany();

  // Synchronize each contract from the YAML to the database.
  for (const contract of data.contracts) {
    await prisma.contract.upsert({
      where: { id: contract.id },
      update: { ...contract },
      create: { ...contract }
    });
  }
};

async function main() {
  console.log("Syncing...");
  console.log("* contracts");
  await syncContracts();
  console.log("Synced!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
