import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import RoleService, { Role } from "./app/services/role-service";
import DomainService from "./app/services/domain-service";
import { SessionUser } from "./app/models/Session";

const LEGACY_ROOT_DOMAIN = ".gitwallet.co";
const ROOT_DOMAIN = ".market.dev";
const CUSTOMER_ROOT_DOMAIN = ".store.dev";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default withAuth(
  async function middleware(req) {
    return await customMiddleware(req);
  },
  {
    callbacks: {
      authorized: async ({ token, req }) => {
        const user = token?.user as SessionUser;
        return await RoleService.canViewPath(
          req.nextUrl.pathname,
          user?.roleId as Role,
        );
      },
    },
  },
);

const rewrite = (path: string, url: string) => {
  return NextResponse.rewrite(new URL(path, url));
};

async function customMiddleware(req: NextRequest) {
  const url = req.nextUrl;
  const rootUrl = DomainService.getRootUrl();

  const ghUsername = DomainService.getGhUsernameFromRequest(req);
  const reservedSubdomain = DomainService.getReservedSubdomainFromRequest(req);
  const bareDomain = !ghUsername && !reservedSubdomain;
  const session = (await getToken({ req })) as any;
  const roleId = session?.user?.roleId;
  const searchParams = req.nextUrl.searchParams.toString();

  let path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;
  path = path === "/" ? "" : path;

  // exempt from middleware rewrites
  if (
    url.pathname.startsWith("/monitoring") ||
    url.pathname.startsWith("/design")
  ) {
    return NextResponse.next();
  }

  // Gitwallet -> Market.dev rebrand: Redirect user subdomains from .gitwallet.co to .store.dev
  if (ghUsername && url.hostname.endsWith(LEGACY_ROOT_DOMAIN)) {
    const newUrl = new URL(req.url);
    newUrl.hostname = newUrl.hostname.replace(
      LEGACY_ROOT_DOMAIN,
      CUSTOMER_ROOT_DOMAIN,
    );
    return NextResponse.redirect(newUrl, 301);
  }

  // Gitwallet -> Market.dev rebrand: Redirect from *.gitwallet.co to *.market.dev unless it's a customer domain
  if (!ghUsername && url.hostname.endsWith(LEGACY_ROOT_DOMAIN)) {
    const newUrl = new URL(req.url);
    newUrl.hostname = newUrl.hostname.replace(LEGACY_ROOT_DOMAIN, ROOT_DOMAIN);
    return NextResponse.redirect(newUrl, 301);
  }

  // market.dev
  if (bareDomain || reservedSubdomain === "sell") {
    if (url.pathname.startsWith("/design")) {
      return rewrite(`/design${path}`, req.url);
    }
    if (url.pathname === "/terms" || url.pathname === "/privacy") {
      return NextResponse.next();
    }
    return rewrite(`/home${path}`, req.url);
  }

  // $GHUSERNAME.store.dev
  // permit API from users' subdomains
  if (!!ghUsername) {
    if (url.pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    return rewrite(`/maintainer-site/${ghUsername}${path}`, req.url);
  }

  // *.market.dev
  const loginPaths = ["/login", "/customer-login", "/login/local-auth"];

  // if you're on a login page and already signed in, kick you to /
  if (session && loginPaths.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // app.market.dev
  if (reservedSubdomain === "app" || DomainService.isVercelPreview(req)) {
    // if customer, then lock to /app/c/

    if (roleId === "customer") {
      if (
        url.pathname.startsWith("/checkout") ||
        url.pathname.startsWith("/success")
      ) {
        return rewrite(`/app${path}`, req.url);
      } else {
        return rewrite(`/app/c${path}`, req.url);
      }
    } else {
      if (
        url.pathname.startsWith("/charges") ||
        url.pathname.startsWith("/subscriptions") ||
        url.pathname.startsWith("/packages")
      ) {
        return NextResponse.redirect(`${rootUrl}/c${path}`);
      }
    }

    if (url.pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    // else lock to /app/
    return rewrite(`/app${path}`, req.url);
  }
}
