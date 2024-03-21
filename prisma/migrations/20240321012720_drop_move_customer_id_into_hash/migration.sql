/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `User` table. All the data in the column will be lost.

*/
  
UPDATE "User"
SET "stripeCustomerIds" = jsonb_set(
    coalesce("stripeCustomerIds", '{}'::jsonb),
    '{gitwallet}', 
    to_jsonb("stripeCustomerId")
);
SET "stripePaymentMethodIds" = jsonb_set(
    coalesce("stripePaymentMethodIds", '{}'::jsonb),
    '{gitwallet}', 
    to_jsonb("stripePaymentMethodId")
);

-- DropIndex
DROP INDEX "User_stripeCustomerId_key";
DROP INDEX "User_stripePaymentMethod_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripeCustomerId";
ALTER TABLE "User" DROP COLUMN "stripePaymentMethodId";

