-- DropIndex
DROP INDEX "Charge_userId_tierId_key";

-- AlterTable
ALTER TABLE "Tier" ALTER COLUMN "cadence" SET DEFAULT 'month';
