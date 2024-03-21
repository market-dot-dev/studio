/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerIds]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable

ALTER TABLE "User"
ADD COLUMN "stripeCustomerIds" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN "stripePaymentMethodIds" JSONB NOT NULL DEFAULT '{}';
  
UPDATE "User"
SET "stripeCustomerIds" = jsonb_set(
    -- coalesce is not strictly necessary since the column now has a NOT NULL DEFAULT constraint
    "stripeCustomerIds",
    '{gitwallet}', 
    -- Handle the possibility of null values by storing them as an empty JSON object
    CASE 
        WHEN "stripeCustomerId" IS NOT NULL THEN to_jsonb("stripeCustomerId")
        ELSE '{}'::jsonb
    END
),
"stripePaymentMethodIds" = jsonb_set(
    "stripePaymentMethodIds",
    '{gitwallet}', 
    CASE 
        WHEN "stripePaymentMethodId" IS NOT NULL THEN to_jsonb("stripePaymentMethodId")
        ELSE '{}'::jsonb
    END
);

-- DropIndex
DROP INDEX "User_stripeCustomerId_key";
DROP INDEX "User_stripePaymentMethod_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripeCustomerId";
ALTER TABLE "User" DROP COLUMN "stripePaymentMethodId";