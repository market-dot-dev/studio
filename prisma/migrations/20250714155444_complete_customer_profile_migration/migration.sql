/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Charge` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerIds` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentMethodIds` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Subscription` table. All the data in the column will be lost.
  - Made the column `customerProfileId` on table `Charge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customerProfileId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Charge" DROP CONSTRAINT "Charge_customerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Charge" DROP CONSTRAINT "Charge_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_customerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_organizationId_fkey";

-- DropIndex
DROP INDEX "Charge_organizationId_tierId_idx";

-- DropIndex
DROP INDEX "Subscription_organizationId_tierId_active_idx";

-- AlterTable
ALTER TABLE "Charge" DROP COLUMN "organizationId",
ALTER COLUMN "customerProfileId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "stripeCustomerIds",
DROP COLUMN "stripePaymentMethodIds",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "organizationId",
ALTER COLUMN "customerProfileId" SET NOT NULL;

-- DropEnum
DROP TYPE "OrganizationType";

-- CreateIndex
CREATE INDEX "Charge_customerProfileId_tierId_idx" ON "Charge"("customerProfileId", "tierId");

-- CreateIndex
CREATE INDEX "Subscription_customerProfileId_tierId_active_idx" ON "Subscription"("customerProfileId", "tierId", "active");

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
