-- AlterTable
ALTER TABLE "Tier" ADD COLUMN     "cadence" TEXT NOT NULL DEFAULT 'month',
ADD COLUMN     "priceAnnual" INTEGER,
ADD COLUMN     "stripePriceIdAnnual" TEXT,
ADD COLUMN     "trialDays" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TierVersion" ADD COLUMN     "cadence" TEXT NOT NULL DEFAULT 'month',
ADD COLUMN     "priceAnnual" INTEGER,
ADD COLUMN     "stripePriceIdAnnual" TEXT,
ADD COLUMN     "trialDays" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Charge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "tierVersionId" TEXT,
    "tierRevision" INTEGER,
    "stripeChargeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Charge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Charge_stripeChargeId_key" ON "Charge"("stripeChargeId");

CREATE UNIQUE INDEX "Charge_userId_tierId_key" ON "Charge"("userId", "tierId");

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_tierVersionId_fkey" FOREIGN KEY ("tierVersionId") REFERENCES "TierVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
