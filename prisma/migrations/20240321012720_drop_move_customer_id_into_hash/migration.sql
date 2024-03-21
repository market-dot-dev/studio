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

-- DropIndex
DROP INDEX "User_stripeCustomerId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripeCustomerId";

