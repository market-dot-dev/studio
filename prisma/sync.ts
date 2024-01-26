import { PrismaClient, Service } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const prisma = new PrismaClient();

async function main() {
  const yamlFile = path.join(__dirname, './sync/services.yaml');
  const fileContents = fs.readFileSync(yamlFile, 'utf8');
  const data = yaml.load(fileContents) as { services: Array<Service> };

  // Retrieve all current services in the database.
  const existingServices = await prisma.service.findMany();
  
  // Synchronize each service from the YAML to the database.
  for (const service of data.services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: { ...service },
      create: { ...service },
    });
  }

  // Determine services not present in the YAML file, to remove them.
  const existingServiceIds = existingServices.map(service => service.id);
  const yamlServiceIds = data.services.map(service => service.id);
  const servicesToRemove = existingServiceIds.filter(id => !yamlServiceIds.includes(id));

  // Remove services not present in the YAML file.
  for (const id of servicesToRemove) {
    await prisma.service.delete({
      where: { id },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });