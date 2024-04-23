/*
  Warnings:

  - You are about to drop the column `dbRepoId` on the `Lead` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_dbRepoId_fkey";

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "dbRepoId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
