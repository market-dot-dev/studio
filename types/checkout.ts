import { Prisma } from "@/app/generated/prisma";

/**
 * Prisma validator for vendor profile with minimal fields
 */
export const includeVendorProfile = Prisma.validator<Prisma.OrganizationDefaultArgs>()({
  select: {
    id: true,
    name: true,
    stripeAccountId: true,
    sites: {
      select: {
        subdomain: true
      }
    }
  }
});

/**
 * Vendor profile data type
 */
export type VendorProfile = Prisma.OrganizationGetPayload<typeof includeVendorProfile>;
