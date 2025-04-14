"use server";

import { NextRequest } from "next/server";

const RESERVED_SUBDOMAINS = ["app", "sell", "blog", "explore"];

class DomainService {
  static getRootUrlFromRequest(req: NextRequest, path: string = "/") {
    const protocol = req.nextUrl.protocol;
    const host = this.getHostnameFromRequest(req);

    return `${protocol}//${host}${path}`;
  }

  static getReservedSubdomainFromRequest(req: NextRequest) {
    if (this.isVercelPreview(req)) {
      return "app";
    }

    const subdomain = this.getSubdomainFromRequest(req);

    console.log("Subdomain: ", subdomain);

    if (!!subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
      return null;
    } else {
      return subdomain;
    }
  }

  static getGhUsernameFromRequest(req: NextRequest) {
    const subdomain = this.getSubdomainFromRequest(req);
    const isPreview = DomainService.isVercelPreview(req);

    if (isPreview || (!!subdomain && RESERVED_SUBDOMAINS.includes(subdomain))) {
      return null;
    } else {
      return subdomain;
    }
  }

  static getHostnameFromRequest(req: NextRequest) {
    return req.headers.get("host") || "";
  }

  static isVercelPreview(req: NextRequest) {
    const host = DomainService.getHostnameFromRequest(req);
    const vercelPreviewUrlPattern =
      /^store-git-[\w-]+-marketdotdev\.(?:vercel\.local|vercel\.app)(?::\d+)?$/;

    return vercelPreviewUrlPattern.test(host);
  }

  static getSubdomainFromRequest(req: NextRequest) {
    const host = DomainService.getHostnameFromRequest(req);

    const parts = host.split(".");

    if (parts.length < 3) {
      return null;
    } else {
      return parts[0];
    }
  }
}

export default DomainService;
