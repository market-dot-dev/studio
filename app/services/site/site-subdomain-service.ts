"use server";

import { RESERVED_SUBDOMAINS } from "@/lib/domain";
import { GitWalletError } from "@/lib/errors";
import prisma from "@/lib/prisma";
import type { SiteDetails } from "@/types/site";

/**
 * Validates a subdomain for format, length, reserved status, and uniqueness
 * @param subdomain - The subdomain to validate
 * @param currentSite - Optional current site (for update scenarios)
 * @throws GitWalletError if validation fails
 */
export async function validateSubdomain(
  subdomain: string,
  currentSite?: SiteDetails
): Promise<void> {
  // Validate subdomain format
  const subdomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/;
  if (!subdomainRegex.test(subdomain)) {
    throw new GitWalletError("Subdomain provided is not valid");
  }

  // Check length constraints
  if (subdomain.length < 3 || subdomain.length > 63) {
    throw new GitWalletError("Subdomain must be between 3 and 63 characters long");
  }

  // Check reserved subdomains
  if (RESERVED_SUBDOMAINS.includes(subdomain)) {
    throw new GitWalletError(`The subdomain "${subdomain}" is reserved and cannot be used`);
  }

  // Check if subdomain is already taken
  const existingSite = await prisma.site.findFirst({
    where: {
      subdomain,
      ...(currentSite && { NOT: { id: currentSite.id } })
    }
  });

  if (existingSite) {
    throw new GitWalletError(`The subdomain "${subdomain}" is already taken.`);
  }
}
