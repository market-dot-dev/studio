import { PrismaClient } from '@prisma/client';
import MigrationService from '@/app/services/MigrationService';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: {
      email: 'tarun.sachdeva@gmail.com',
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  console.log('Migrating user: ', user.email);
  await MigrationService.migrateUser(user);
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