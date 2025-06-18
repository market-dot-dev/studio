/*
  Warnings:

  - The values [FREE_TRIAL,TRIALING,EXPIRED] on the enum `SubscriptionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `planName` on the `OrganizationBilling` table. All the data in the column will be lost.
  - You are about to drop the column `trialEndAt` on the `OrganizationBilling` table. All the data in the column will be lost.
  - You are about to drop the column `trialStartAt` on the `OrganizationBilling` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'PRO', 'CUSTOM');

-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionStatus_new" AS ENUM ('ACTIVE', 'CANCELED', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'PAST_DUE', 'UNPAID');
ALTER TABLE "OrganizationBilling" ALTER COLUMN "subscriptionStatus" DROP DEFAULT;
ALTER TABLE "OrganizationBilling" ALTER COLUMN "subscriptionStatus" TYPE "SubscriptionStatus_new" USING ("subscriptionStatus"::text::"SubscriptionStatus_new");
ALTER TYPE "SubscriptionStatus" RENAME TO "SubscriptionStatus_old";
ALTER TYPE "SubscriptionStatus_new" RENAME TO "SubscriptionStatus";
DROP TYPE "SubscriptionStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "OrganizationBilling" DROP COLUMN "planName",
DROP COLUMN "trialEndAt",
DROP COLUMN "trialStartAt",
ADD COLUMN     "planType" "PlanType" NOT NULL DEFAULT 'FREE',
ALTER COLUMN "subscriptionStatus" DROP NOT NULL,
ALTER COLUMN "subscriptionStatus" DROP DEFAULT;
