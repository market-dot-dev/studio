import { PrismaClient } from '@prisma/client';
import { processEvents } from '@/app/services/stripe-event';

const prisma = new PrismaClient();

async function main() {
  console.log('Processing events');
  await processEvents();
  
  console.log('Done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });