'use server';

import { NextRequest } from "next/server";
import { getRootUrl as getRootUrlClient } from "./client-functions";
const RESERVED_SUBDOMAINS = ['app', 'alpha'];

class DomainService {
  static getRootUrl(subdomain: string = 'app', path: string = '/') {
    return getRootUrlClient(subdomain, path);
  }

  static getRootUrlFromRequest(req: NextRequest, path: string = '/') {
    const protocol = req.nextUrl.protocol;
    const host = this.getHostnameFromRequest(req);
    
    return `${protocol}//${host}${path}`;
  }

  static getReservedSubdomainFromRequest(req: NextRequest) {
    const subdomain = this.getSubdomainFromRequest(req);
    
    console.log("Subdomain: ", subdomain);

    if(!!subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
      return null;
    } else {
      return subdomain;
    }
  }

  static getGhUsernameFromRequest(req: NextRequest) {
    const subdomain = this.getSubdomainFromRequest(req);

    if(!!subdomain && RESERVED_SUBDOMAINS.includes(subdomain)) {
      return null;
    } else {
      return subdomain;
    }
  }

  static getHostnameFromRequest(req: NextRequest) {
    return req.headers.get('host') || '';
    //return req.nextUrl.host;
  }

  static getSubdomainFromRequest(req: NextRequest) {
    let host = DomainService.getHostnameFromRequest(req);

    // special case for Vercel preview deployment URLs
    if (
      host.includes("---") &&
      host.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
    ) {
      host = `${host.split("---")[0]}.${
        process.env.NEXT_PUBLIC_ROOT_DOMAIN
      }`;
    }

    const parts = host.split('.');

    if(parts.length < 3) {
      return null;
    } else {
      return parts[0];
    }
  }
}

export default DomainService;

export const { getRootUrl } = DomainService;