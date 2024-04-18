/*
  Warnings:

  - Changed the type of `maintainers` on the `Lead` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "maintainers",
ADD COLUMN     "maintainers" JSONB NOT NULL;
