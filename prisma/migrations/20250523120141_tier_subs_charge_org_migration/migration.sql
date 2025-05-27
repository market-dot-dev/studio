/*
  Warnings:

  - You are about to drop the column `userId` on the `Charge` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Tier` table. All the data in the column will be lost.
  - Made the column `organizationId` on table `Charge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Charge" DROP CONSTRAINT "Charge_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Charge" DROP CONSTRAINT "Charge_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tier" DROP CONSTRAINT "Tier_userId_fkey";

-- DropIndex
DROP INDEX "Subscription_userId_tierId_active_idx";

-- DropIndex
DROP INDEX "Tier_userId_stripePriceId_idx";

-- AlterTable
ALTER TABLE "Charge" DROP COLUMN "userId",
ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "userId",
ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tier" DROP COLUMN "userId";

-- CreateIndex
CREATE INDEX "Charge_organizationId_tierId_idx" ON "Charge"("organizationId", "tierId");

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
