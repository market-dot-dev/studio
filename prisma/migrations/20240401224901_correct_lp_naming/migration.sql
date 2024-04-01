/*
  Warnings:

  - Made the column `stripeProductId` on table `LegacyProduct` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LegacyProduct" RENAME CONSTRAINT "LegacyProducts_pkey" TO "LegacyProduct_pkey";

ALTER TABLE "LegacyProduct"
  ALTER COLUMN "id" DROP DEFAULT,
  ALTER COLUMN "stripeProductId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "LegacyProduct" ADD CONSTRAINT "LegacyProduct_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegacyProduct" ADD CONSTRAINT "LegacyProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegacyProduct" ADD CONSTRAINT "LegacyProduct_maintainerUserId_fkey" FOREIGN KEY ("maintainerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegacyProduct" ADD CONSTRAINT "LegacyProduct_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
