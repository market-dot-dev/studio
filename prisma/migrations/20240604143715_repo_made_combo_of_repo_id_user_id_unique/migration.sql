/*
  Warnings:

  - A unique constraint covering the columns `[repoId,userId]` on the table `Repo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Repo_repoId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Repo_repoId_userId_key" ON "Repo"("repoId", "userId");
