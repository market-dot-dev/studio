/*
  Warnings:

  - Added the required column `stripeStatus` to the `Charge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Charge" ADD COLUMN     "stripeStatus" TEXT NOT NULL;
