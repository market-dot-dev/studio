-- CreateEnum
CREATE TYPE "public"."ProspectState" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "public"."Prospect" ADD COLUMN     "state" "public"."ProspectState" NOT NULL DEFAULT 'ACTIVE';
