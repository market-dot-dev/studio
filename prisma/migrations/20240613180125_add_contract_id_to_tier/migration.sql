-- AlterTable
ALTER TABLE "Tier" ADD COLUMN     "contractId" TEXT;

-- AddForeignKey
ALTER TABLE "Tier" ADD CONSTRAINT "Tier_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;
