/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Site` table. All the data in the column will be lost.
  - Made the column `organizationId` on table `Site` required. This step will fail if there are existing NULL values in that column.

*/

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_userId_fkey";

-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_userId_fkey";

-- DropIndex
DROP INDEX "Page_organizationId_idx";

-- DropIndex
DROP INDEX "Page_userId_idx";

-- DropIndex
DROP INDEX "Site_userId_idx";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "organizationId",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "userId",
ALTER COLUMN "organizationId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Site_subdomain_idx" ON "Site"("subdomain");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
