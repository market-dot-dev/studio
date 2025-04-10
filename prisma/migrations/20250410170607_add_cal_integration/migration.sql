-- CreateTable
CREATE TABLE "CalIntegration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalIntegration_userId_idx" ON "CalIntegration"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CalIntegration_userId_key" ON "CalIntegration"("userId");

-- AddForeignKey
ALTER TABLE "CalIntegration" ADD CONSTRAINT "CalIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
