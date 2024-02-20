-- Since dev stripe tokens are not valid in production, we need to clear them out
UPDATE "User"
SET 
    "stripeProductId" = NULL,
    "stripeCustomerId" = NULL,
    "stripePaymentMethodId" = NULL,
    "stripeAccountId" = NULL,
    "stripeCSRF" = NULL;

UPDATE "Tier" SET "stripePriceId" = NULL;

UPDATE "Subscription" SET "stripeSubscriptionId" = NULL;