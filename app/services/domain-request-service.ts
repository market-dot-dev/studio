"use server";

import { RESERVED_SUBDOMAINS } from "@/lib/domain";
import { NextRequest } from "next/server";

/**
 * Gets the root URL from a request
 * @param req - The Next.js request object
 * @param path - Optional path to append to the root URL
 * @returns The complete root URL
 */
export async function getRootUrlFromRequest(req: NextRequest, path: string = "/") {
  const protocol = req.nextUrl.protocol;
  const host = await getHostnameFromRequest(req);

  return `${protocol}//${host}${path}`;
}

/**
 * Gets the hostname from a request
 * @param req - The Next.js request object
 * @returns The hostname
 */
export async function getHostnameFromRequest(req: NextRequest) {
  return req.headers.get("host") || "";
}

/**
 * Checks if the request is from a Vercel preview environment
 * @param req - The Next.js request object
 * @returns Whether the request is from a Vercel preview
 */
export async function isVercelPreview(req: NextRequest) {
  const host = await getHostnameFromRequest(req);
  const vercelPreviewUrlPattern =
    /^store-git-[\w-]+-marketdotdev\.(?:vercel\.local|vercel\.app)(?::\d+)?$/;

  return vercelPreviewUrlPattern.test(host);
}

/**
 * Gets the subdomain from a request
 * @param req - The Next.js request object
 * @returns The subdomain or null if not present
 */
export async function getSubdomainFromRequest(req: NextRequest) {
  const host = await getHostnameFromRequest(req);
  const parts = host.split(".");
  console.log("Host", req.headers);
  console.log("Parts", parts);

  if (parts.length < 3) {
    return null;
  } else {
    return parts[0];
  }
}

/**
 * Gets the reserved subdomain from a request if it exists
 * @param req - The Next.js request object
 * @returns The reserved subdomain or null
 */
export async function getReservedSubdomainFromRequest(req: NextRequest) {
  if (await isVercelPreview(req)) {
    return "app";
  }

  const subdomain = await getSubdomainFromRequest(req);
  console.log("Subdomain received", subdomain);

  if (!!subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
    return null;
  } else {
    return subdomain;
  }
}

/**
 * Gets the GitHub username from a request subdomain
 * @param req - The Next.js request object
 * @returns The GitHub username or null
 */
export async function getGhUsernameFromRequest(req: NextRequest) {
  const subdomain = await getSubdomainFromRequest(req);
  const isPreview = await isVercelPreview(req);

  if (isPreview || (!!subdomain && RESERVED_SUBDOMAINS.includes(subdomain))) {
    return null;
  } else {
    return subdomain;
  }
}
