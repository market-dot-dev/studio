/*
  Warnings:

  - You are about to drop the column `legacyStripeProductId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FeatureToTier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FeatureToTierVersion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_userId_fkey";

-- DropForeignKey
ALTER TABLE "_FeatureToTier" DROP CONSTRAINT "_FeatureToTier_A_fkey";

-- DropForeignKey
ALTER TABLE "_FeatureToTier" DROP CONSTRAINT "_FeatureToTier_B_fkey";

-- DropForeignKey
ALTER TABLE "_FeatureToTierVersion" DROP CONSTRAINT "_FeatureToTierVersion_A_fkey";

-- DropForeignKey
ALTER TABLE "_FeatureToTierVersion" DROP CONSTRAINT "_FeatureToTierVersion_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "legacyStripeProductId";

-- DropTable
DROP TABLE "Feature";

-- DropTable
DROP TABLE "Service";

-- DropTable
DROP TABLE "_FeatureToTier";

-- DropTable
DROP TABLE "_FeatureToTierVersion";
