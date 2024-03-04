-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "activeUntil" TIMESTAMP(3),
ADD COLUMN     "cancelledAt" TIMESTAMP(3);
