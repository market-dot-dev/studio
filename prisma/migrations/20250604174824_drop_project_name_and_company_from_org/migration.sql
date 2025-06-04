/*
  Warnings:

  - You are about to drop the column `company` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `projectName` on the `Organization` table. All the data in the column will be lost.
  - The `projectDescription` column on the `Organization` table will be renamed to `description`.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "company",
DROP COLUMN "projectName";

-- Rename projectDescription to description
ALTER TABLE "Organization" RENAME COLUMN "projectDescription" TO "description";