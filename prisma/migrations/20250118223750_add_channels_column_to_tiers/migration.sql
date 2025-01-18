-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('site', 'market');

-- AlterTable
ALTER TABLE "Tier" ADD COLUMN     "channels" "Channel"[] DEFAULT ARRAY['site']::"Channel"[];
