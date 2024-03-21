/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerIds]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User"
ADD COLUMN "stripeCustomerIds" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN "stripePaymentMethodIds" JSONB NOT NULL DEFAULT '{}';
