/*
  Warnings:

  - You are about to drop the `TierFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TierFeatureToTierVersion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stripeAccountId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeCSRF]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Site` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tierId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_tierId_fkey";

-- DropForeignKey
ALTER TABLE "TierFeature" DROP CONSTRAINT "TierFeature_tierId_fkey";

-- DropForeignKey
ALTER TABLE "TierFeature" DROP CONSTRAINT "TierFeature_userId_fkey";

-- DropForeignKey
ALTER TABLE "_TierFeatureToTierVersion" DROP CONSTRAINT "_TierFeatureToTierVersion_A_fkey";

-- DropForeignKey
ALTER TABLE "_TierFeatureToTierVersion" DROP CONSTRAINT "_TierFeatureToTierVersion_B_fkey";

-- AlterTable
ALTER TABLE "Site" ALTER COLUMN "logo" SET DEFAULT 'https://www.gitwallet.co/gw-logo.png',
ALTER COLUMN "image" SET DEFAULT 'https://www.gitwallet.co/placeholder.png',
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "tierId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "company" TEXT,
ADD COLUMN     "onboarding" TEXT,
ADD COLUMN     "projectDescription" TEXT,
ADD COLUMN     "projectName" TEXT,
ADD COLUMN     "roleId" TEXT NOT NULL DEFAULT 'customer',
ADD COLUMN     "stripeAccountId" TEXT,
ADD COLUMN     "stripeCSRF" TEXT;

-- DropTable
DROP TABLE "TierFeature";

-- DropTable
DROP TABLE "_TierFeatureToTierVersion";

-- CreateTable
CREATE TABLE "Repo" (
    "id" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Repo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "requiresUri" BOOLEAN NOT NULL,
    "protocol" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "uri" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serviceId" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FeatureToTier" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FeatureToTierVersion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Repo_repoId_key" ON "Repo"("repoId");

-- CreateIndex
CREATE INDEX "Feature_userId_idx" ON "Feature"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_FeatureToTier_AB_unique" ON "_FeatureToTier"("A", "B");

-- CreateIndex
CREATE INDEX "_FeatureToTier_B_index" ON "_FeatureToTier"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FeatureToTierVersion_AB_unique" ON "_FeatureToTierVersion"("A", "B");

-- CreateIndex
CREATE INDEX "_FeatureToTierVersion_B_index" ON "_FeatureToTierVersion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeAccountId_key" ON "User"("stripeAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCSRF_key" ON "User"("stripeCSRF");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repo" ADD CONSTRAINT "Repo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureToTier" ADD CONSTRAINT "_FeatureToTier_A_fkey" FOREIGN KEY ("A") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureToTier" ADD CONSTRAINT "_FeatureToTier_B_fkey" FOREIGN KEY ("B") REFERENCES "Tier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureToTierVersion" ADD CONSTRAINT "_FeatureToTierVersion_A_fkey" FOREIGN KEY ("A") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureToTierVersion" ADD CONSTRAINT "_FeatureToTierVersion_B_fkey" FOREIGN KEY ("B") REFERENCES "TierVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
