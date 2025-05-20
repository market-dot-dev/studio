/*
  Warnings:

  - You are about to drop the column `maintainerId` on the `Contract` table. All the data in the column will be lost.
  - Made the column `organizationId` on table `Tier` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_maintainerId_fkey";

-- DropForeignKey
ALTER TABLE "Tier" DROP CONSTRAINT "Tier_organizationId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "maintainerId";

-- AlterTable
ALTER TABLE "Tier" ALTER COLUMN "organizationId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Tier" ADD CONSTRAINT "Tier_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
