/*
  Warnings:

  - You are about to drop the `GithubAppInstallation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GithubOrgMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Repo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GithubOrgMember" DROP CONSTRAINT "GithubOrgMember_githubAppInstallationId_fkey";

-- DropForeignKey
ALTER TABLE "Repo" DROP CONSTRAINT "Repo_userId_fkey";

-- DropTable
DROP TABLE "GithubAppInstallation";

-- DropTable
DROP TABLE "GithubOrgMember";

-- DropTable
DROP TABLE "Repo";
