/*
  Warnings:

  - A unique constraint covering the columns `[stripeProductId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `Tier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revision` to the `Tier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `TierVersion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revision` to the `TierVersion` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TierFeature_userId_idx";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "tierId" TEXT;

-- AlterTable
ALTER TABLE "Tier" ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "revision" INTEGER NOT NULL,
ADD COLUMN     "stripePriceId" TEXT;

-- AlterTable
ALTER TABLE "TierFeature" ADD COLUMN     "tierId" TEXT;

-- AlterTable
ALTER TABLE "TierVersion" ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "revision" INTEGER NOT NULL,
ADD COLUMN     "stripePriceId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeProductId" TEXT;

-- CreateIndex
CREATE INDEX "Tier_userId_stripePriceId_idx" ON "Tier"("userId", "stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeProductId_key" ON "User"("stripeProductId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "TierFeature" ADD CONSTRAINT "TierFeature_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
