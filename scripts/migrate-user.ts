import { PrismaClient } from '@prisma/client';
import MigrationService from '@/app/services/MigrationService';

const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.user.findMany();
  const users = allUsers.filter((u) => u.email !== 'tarun.sachdeva@gmail.com');
    
  for (const user of users) {
    console.log('Migrating user: ', user.email);

    if(user.stripeAccountId) {
      await MigrationService.migrateUser(user);  
    } else {
      console.log(`Skipping ${user.email}, does not have a connected stripe account`);
    }    
  }

  console.log('Migration complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });