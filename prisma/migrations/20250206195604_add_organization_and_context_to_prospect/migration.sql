/*
  Warnings:

  - Added the required column `context` to the `Prospect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization` to the `Prospect` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prospect" ADD COLUMN     "context" TEXT NOT NULL,
ADD COLUMN     "organization" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "_FeatureToTier" ADD CONSTRAINT "_FeatureToTier_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FeatureToTier_AB_unique";

-- AlterTable
ALTER TABLE "_FeatureToTierVersion" ADD CONSTRAINT "_FeatureToTierVersion_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FeatureToTierVersion_AB_unique";

-- AlterTable
ALTER TABLE "_ProspectToTier" ADD CONSTRAINT "_ProspectToTier_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProspectToTier_AB_unique";
