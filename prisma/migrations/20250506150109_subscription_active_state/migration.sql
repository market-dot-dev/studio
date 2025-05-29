/*
  Warnings:

  - You are about to drop the column `font` on the `Site` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Subscription_userId_tierId_key";

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "font";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Subscription_userId_tierId_active_idx" ON "Subscription"("userId", "tierId", "active");
