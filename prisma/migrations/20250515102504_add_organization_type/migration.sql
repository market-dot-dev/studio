-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('VENDOR', 'BILLING');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "type" "OrganizationType" NOT NULL DEFAULT 'BILLING';
