-- AlterTable
ALTER TABLE "Repo" ADD COLUMN     "radarId" INTEGER;

-- CreateTable
CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "host" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "description" TEXT,
    "email" TEXT,
    "website" TEXT,
    "location" TEXT,
    "twitter" TEXT,
    "company" TEXT,
    "icon_url" TEXT,
    "repositories_count" INTEGER NOT NULL,
    "last_synced_at" TIMESTAMP(3) NOT NULL,
    "html_url" TEXT NOT NULL,
    "total_stars" INTEGER,
    "dependent_repos_count" INTEGER NOT NULL,
    "followers" INTEGER,
    "following" INTEGER,
    "maintainers" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dbRepoId" TEXT NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_host_uuid_key" ON "Lead"("host", "uuid");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_dbRepoId_fkey" FOREIGN KEY ("dbRepoId") REFERENCES "Repo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
