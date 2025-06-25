-- AlterTable
ALTER TABLE "Organization" ADD COLUMN "onboarding" JSONB;

-- Set all existing organizations as having completed onboarding
UPDATE "Organization" 
SET "onboarding" = '{"organization":{"completed":true},"team":{"completed":true},"stripe":{"completed":true},"pricing":{"completed":true},"completed":true,"completedAt":"2025-06-20T00:00:00.000Z"}'::jsonb
WHERE "onboarding" IS NULL;
