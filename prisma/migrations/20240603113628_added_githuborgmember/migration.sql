/*
  Warnings:

  - You are about to drop the column `userId` on the `GithubAppInstallation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GithubAppInstallation" DROP CONSTRAINT "GithubAppInstallation_userId_fkey";

-- AlterTable
ALTER TABLE "GithubAppInstallation" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "GithubOrgMember" (
    "id" SERIAL NOT NULL,
    "gh_id" INTEGER NOT NULL,
    "githubAppInstallationId" INTEGER NOT NULL,

    CONSTRAINT "GithubOrgMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GithubOrgMember_githubAppInstallationId_gh_id_key" ON "GithubOrgMember"("githubAppInstallationId", "gh_id");

-- AddForeignKey
ALTER TABLE "GithubOrgMember" ADD CONSTRAINT "GithubOrgMember_githubAppInstallationId_fkey" FOREIGN KEY ("githubAppInstallationId") REFERENCES "GithubAppInstallation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
