export const RESERVED_SUBDOMAINS = [
  "alpha",
  "beta",
  "www",
  "mail",
  "admin",
  "blog",
  "ftp",
  "webmail",
  "sell",
  "app",
  "market",
  "email",
  "api",
  "notifications",
  "support",
  "billing",
  "deploy",
  "create",
  "help",
  "docs",
  "store",
  "explore",
  "data",
  "dashboard",
  "settings",
  "legal",
  "admin",
  "studio",
  "sites"
];

/**
 * Protocol to use for URLs (http in development, https in production)
 */
const PROTOCOL = process.env.NEXT_PUBLIC_VERCEL_ENV === "development" ? "http" : "https";

/**
 * Constructs a root URL with optional subdomain and path
 * @param subdomain - Optional subdomain to prepend to the root domain
 * @param path - Optional path to append to the URL
 * @returns The complete URL
 */
export function getRootUrl(subdomain: string = "app", path: string = "/") {
  const host = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  const url = subdomain
    ? `${PROTOCOL}://${subdomain}.${host}${path}`
    : `${PROTOCOL}://${host}${path}`;

  return url;
}

/**
 * Creates a human-readable domain string for display purposes
 * @param subdomain - Optional subdomain to prepend
 * @returns The formatted domain string
 */
export function domainCopy(subdomain: string = "") {
  const domain = subdomain ? `${subdomain}.` : "";
  const uri = `${domain}${process.env.NEXT_PUBLIC_ROOT_DOMAIN_COPY}`;

  return uri;
}
