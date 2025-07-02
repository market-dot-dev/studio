/*
  Warnings:

  - You are about to drop the column `marketExpertId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `gh_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gh_username` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('GITHUB_APP');

-- DropIndex
DROP INDEX "User_gh_username_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "marketExpertId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gh_id",
DROP COLUMN "gh_username";

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" "IntegrationType" NOT NULL,
    "installationId" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "repositories" JSONB,
    "installedBy" TEXT,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Integration_organizationId_idx" ON "Integration"("organizationId");

-- CreateIndex
CREATE INDEX "Integration_type_idx" ON "Integration"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_organizationId_type_key" ON "Integration"("organizationId", "type");

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_installedBy_fkey" FOREIGN KEY ("installedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
