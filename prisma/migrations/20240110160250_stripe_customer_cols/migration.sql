/*
  Warnings:

  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,tierId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripePaymentMethodId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeSubscriptionId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_tierVersionId_fkey";

-- DropIndex
DROP INDEX "Subscription_userId_tierVersionId_key";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "stripeSubscriptionId" TEXT NOT NULL,
ALTER COLUMN "tierVersionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripePaymentMethodId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_tierId_key" ON "Subscription"("userId", "tierId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripePaymentMethodId_key" ON "User"("stripePaymentMethodId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tierVersionId_fkey" FOREIGN KEY ("tierVersionId") REFERENCES "TierVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
