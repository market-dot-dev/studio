/*
  Warnings:

  - The values [BILLING] on the enum `OrganizationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `gh_id` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `gh_username` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrganizationType_new" AS ENUM ('VENDOR', 'CUSTOMER');
ALTER TABLE "Organization" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Organization" ALTER COLUMN "type" TYPE "OrganizationType_new" USING ("type"::text::"OrganizationType_new");
ALTER TYPE "OrganizationType" RENAME TO "OrganizationType_old";
ALTER TYPE "OrganizationType_new" RENAME TO "OrganizationType";
DROP TYPE "OrganizationType_old";
ALTER TABLE "Organization" ALTER COLUMN "type" SET DEFAULT 'CUSTOMER';
COMMIT;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "gh_id",
DROP COLUMN "gh_username",
ALTER COLUMN "type" SET DEFAULT 'CUSTOMER';
