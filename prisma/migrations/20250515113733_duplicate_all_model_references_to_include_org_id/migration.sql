/*
  Warnings:

  - You are about to drop the column `organization` on the `Prospect` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Charge" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "Prospect" DROP COLUMN "organization",
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Tier" ADD COLUMN     "organizationId" TEXT;

-- CreateIndex
CREATE INDEX "Page_organizationId_idx" ON "Page"("organizationId");

-- CreateIndex
CREATE INDEX "Site_organizationId_idx" ON "Site"("organizationId");

-- CreateIndex
CREATE INDEX "Subscription_organizationId_tierId_active_idx" ON "Subscription"("organizationId", "tierId", "active");

-- CreateIndex
CREATE INDEX "Tier_organizationId_stripePriceId_idx" ON "Tier"("organizationId", "stripePriceId");

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tier" ADD CONSTRAINT "Tier_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
