/*
  Warnings:

  - You are about to drop the column `applicationFeePercent` on the `Tier` table. All the data in the column will be lost.
  - You are about to drop the column `applicationFeePrice` on the `Tier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tier" DROP COLUMN "applicationFeePercent",
DROP COLUMN "applicationFeePrice";
