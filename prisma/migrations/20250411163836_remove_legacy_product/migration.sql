/*
  Warnings:

  - You are about to drop the `LegacyProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LegacyProduct" DROP CONSTRAINT "LegacyProduct_maintainerUserId_fkey";

-- DropForeignKey
ALTER TABLE "LegacyProduct" DROP CONSTRAINT "LegacyProduct_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "LegacyProduct" DROP CONSTRAINT "LegacyProduct_tierId_fkey";

-- DropForeignKey
ALTER TABLE "LegacyProduct" DROP CONSTRAINT "LegacyProduct_userId_fkey";

-- DropTable
DROP TABLE "LegacyProduct";
