-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationBilling" DROP CONSTRAINT "OrganizationBilling_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Prospect" DROP CONSTRAINT "Prospect_organizationId_fkey";

-- AddForeignKey
ALTER TABLE "OrganizationBilling" ADD CONSTRAINT "OrganizationBilling_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
