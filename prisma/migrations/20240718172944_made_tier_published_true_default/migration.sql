/*
  Warnings:

  - Made the column `storage` on table `Contract` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Contract" ALTER COLUMN "storage" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tier" ALTER COLUMN "published" SET DEFAULT true;
