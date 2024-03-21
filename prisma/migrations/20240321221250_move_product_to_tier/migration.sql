/*
  Warnings:

  - You are about to drop the column `stripeProductId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeProductId]` on the table `Tier` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_stripeProductId_key";

-- AlterTable
ALTER TABLE "Tier" ADD COLUMN     "stripeProductId" TEXT;

-- CreateTable
CREATE TABLE "LegacyProducts" (
    "id" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "stripeProductId" TEXT NOT NULL,

    CONSTRAINT "LegacyProducts_pkey" PRIMARY KEY ("id")
);

INSERT INTO "LegacyProducts" ("tierId", "subscriptionId", "stripeProductId")
SELECT s."tierId", s.id AS "subscriptionId", t."stripeProductId"
FROM "Subscription" s
JOIN "Tier" t ON s."tierId" = t.id;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripeProductId";

-- CreateIndex
CREATE UNIQUE INDEX "Tier_stripeProductId_key" ON "Tier"("stripeProductId");
