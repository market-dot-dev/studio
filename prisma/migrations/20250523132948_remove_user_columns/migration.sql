/*
  Warnings:

  - You are about to drop the column `businessLocation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `businessType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `marketExpertId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `projectDescription` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `projectName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeAccountDisabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeAccountDisabledReason` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeAccountId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCSRF` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerIds` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentMethodIds` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_stripeAccountId_key";

-- DropIndex
DROP INDEX "User_stripeCSRF_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "businessLocation",
DROP COLUMN "businessType",
DROP COLUMN "company",
DROP COLUMN "marketExpertId",
DROP COLUMN "projectDescription",
DROP COLUMN "projectName",
DROP COLUMN "stripeAccountDisabled",
DROP COLUMN "stripeAccountDisabledReason",
DROP COLUMN "stripeAccountId",
DROP COLUMN "stripeCSRF",
DROP COLUMN "stripeCustomerIds",
DROP COLUMN "stripePaymentMethodIds";
