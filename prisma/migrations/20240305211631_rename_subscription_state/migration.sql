-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "state" SET DEFAULT 'renewing';
UPDATE "Subscription" SET "state" = 'renewing' WHERE "state" = 'active';

