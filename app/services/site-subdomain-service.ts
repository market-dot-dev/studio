"use server";

import { GitWalletError } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { Site } from "@prisma/client";
import fs from "fs";
import yaml from "js-yaml";

/**
 * Loads reserved subdomains from a configuration file
 * @returns Array of reserved subdomain strings
 */
async function loadReservedSubdomains() {
  try {
    const filePath = process.cwd() + "/config/reserved-subdomains.yaml";
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as string[];
    return data;
  } catch (e) {
    console.error(e);
    return []; // Return an empty array as a fallback
  }
}

// Load reserved subdomains on module initialization
const reservedSubdomains = loadReservedSubdomains();

/**
 * Validates a subdomain for format, length, reserved status, and uniqueness
 * @param subdomain - The subdomain to validate
 * @param currentSite - Optional current site (for update scenarios)
 * @throws GitWalletError if validation fails
 */
export async function validateSubdomain(subdomain: string, currentSite?: Site): Promise<void> {
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
  if ((await reservedSubdomains).includes(subdomain)) {
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
