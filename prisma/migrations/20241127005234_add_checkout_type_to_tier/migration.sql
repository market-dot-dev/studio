-- AlterTable
ALTER TABLE "Tier" ADD COLUMN     "checkoutType" TEXT NOT NULL DEFAULT 'gitwallet',
ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TierVersion" ALTER COLUMN "price" DROP NOT NULL;
