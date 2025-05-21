/*
  Warnings:

  - You are about to drop the column `userId` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Prospect` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,organizationId]` on the table `Prospect` will be added. If there are existing duplicate values, this will fail.
  - Made the column `organizationId` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizationId` on table `Prospect` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_userId_fkey";

-- DropForeignKey
ALTER TABLE "Prospect" DROP CONSTRAINT "Prospect_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Prospect" DROP CONSTRAINT "Prospect_userId_fkey";

-- DropIndex
DROP INDEX "Prospect_email_userId_key";

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "userId",
ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Prospect" DROP COLUMN "userId",
ALTER COLUMN "organizationId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_email_organizationId_key" ON "Prospect"("email", "organizationId");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
