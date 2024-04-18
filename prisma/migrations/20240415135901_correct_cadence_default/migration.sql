-- AlterTable
ALTER TABLE "Tier" ALTER COLUMN "cadence" SET DEFAULT 'month';
UPDATE "Tier" SET "cadence" = 'month' WHERE "cadence" IS NULL OR "cadence" = 'monthly';

ALTER TABLE "TierVersion" ALTER COLUMN "cadence" SET DEFAULT 'month';
UPDATE "TierVersion" SET "cadence" = 'month' WHERE "cadence" IS NULL OR "cadence" = 'monthly';
