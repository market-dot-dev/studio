const PROTOCOL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "development" ? "http" : "https";

export function getRootUrl(subdomain: string = "app", path: string = "/") {
  const host = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  const url = subdomain
    ? `${PROTOCOL}://${subdomain}.${host}`
    : `${PROTOCOL}://${host}`;

  return url;
}

export function domainCopy(subdomain: string = "") {
  const domain = subdomain ? `${subdomain}.` : "";
  const uri = `${domain}${process.env.NEXT_PUBLIC_ROOT_DOMAIN_COPY}`;

  return uri;
}
