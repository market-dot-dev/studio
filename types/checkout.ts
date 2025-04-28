import { Prisma } from "@prisma/client";

/**
 * Prisma validator for vendor profile with minimal fields
 */
export const includeVendorProfile = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    name: true,
    projectName: true,
    company: true,
    stripeAccountId: true
  }
});

/**
 * Vendor profile data type
 */
export type VendorProfile = Prisma.UserGetPayload<typeof includeVendorProfile>;
