'use server';

import { NextRequest } from "next/server";

const RESERVED_SUBDOMAINS = ['app', 'alpha', 'sell'];
const PROTOCOL = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' ? 'http' : 'https';

class DomainService {
  static getRootUrl(subdomain: string = 'app', path: string = '/') {
    const host = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    const uri = `${PROTOCOL}://${subdomain}.${host}`;

    const url = new URL(path, uri);
    
    url.port = process.env.PORT || '';

    return url.toString();
  }

  static getRootUrlFromRequest(req: NextRequest, path: string = '/') {
    const protocol = req.nextUrl.protocol;
    const host = this.getHostnameFromRequest(req);
    
    return `${protocol}//${host}${path}`;
  }

  static getReservedSubdomainFromRequest(req: NextRequest) {
    if(this.isVercelPreview(req)) {
      return 'app';
    }

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
    const isPreview = DomainService.isVercelPreview(req);

    if(isPreview || (!!subdomain && RESERVED_SUBDOMAINS.includes(subdomain))) {
      return null;
    } else {
      return subdomain;
    }
  }

  static getHostnameFromRequest(req: NextRequest) {
    return req.headers.get('host') || '';
  }

  static isVercelPreview(req: NextRequest) {
    let host = DomainService.getHostnameFromRequest(req);
    const vercelPreviewUrlPattern = /^gitwallet-web-git-[\w-]+-lab0324\.(?:vercel\.local|vercel\.app)(?::\d+)?$/;

    return vercelPreviewUrlPattern.test(host);
  }

  static getSubdomainFromRequest(req: NextRequest) {
    let host = DomainService.getHostnameFromRequest(req);

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