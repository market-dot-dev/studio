-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('site', 'market');

-- AlterTable
ALTER TABLE "Tier" ADD COLUMN     "channels" "Channel"[] NOT NULL DEFAULT ARRAY['site']::"Channel"[];
