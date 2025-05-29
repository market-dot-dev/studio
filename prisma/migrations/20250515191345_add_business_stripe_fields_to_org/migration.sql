/*
  Warnings:

  - A unique constraint covering the columns `[stripeAccountId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeCSRF]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "businessLocation" TEXT,
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "gh_id" INTEGER,
ADD COLUMN     "gh_username" TEXT,
ADD COLUMN     "marketExpertId" TEXT,
ADD COLUMN     "projectDescription" TEXT,
ADD COLUMN     "projectName" TEXT,
ADD COLUMN     "stripeAccountDisabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripeAccountDisabledReason" TEXT,
ADD COLUMN     "stripeAccountId" TEXT,
ADD COLUMN     "stripeCSRF" TEXT,
ADD COLUMN     "stripeCustomerIds" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "stripePaymentMethodIds" JSONB NOT NULL DEFAULT '{}';

-- CreateIndex
CREATE UNIQUE INDEX "Organization_stripeAccountId_key" ON "Organization"("stripeAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_stripeCSRF_key" ON "Organization"("stripeCSRF");
