import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { SessionUser } from "./app/models/Session";
import DomainService from "./app/services/domain-service";
import RoleService, { Role } from "./app/services/role-service";
import { getRootUrl } from "./lib/domain";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - public contract pages (c/contracts/)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|c/contracts/|[\\w-]+\\.\\w+).*)"
  ]
};

export default withAuth(
  async function middleware(req) {
    return await customMiddleware(req);
  },
  {
    callbacks: {
      authorized: async ({ token, req }) => {
        const user = token?.user as SessionUser;
        const roleId = (user?.roleId as Role) || "anonymous";
        const path = req.nextUrl.pathname;

        // Allow access if this is a site subdomain (GitHub username or custom subdomain)
        // Check for this before the path check
        const subdomain = DomainService.getSubdomainFromRequest(req);
        const isReservedSubdomain = DomainService.getReservedSubdomainFromRequest(req);

        // If this is a subdomain that isn't reserved, it's a site subdomain that should be publicly accessible
        if (subdomain && !isReservedSubdomain) {
          return true;
        }

        return await RoleService.canViewPath(path, roleId);
      }
    }
  }
);

const rewrite = (path: string, url: string) => {
  return NextResponse.rewrite(new URL(path, url));
};

async function customMiddleware(req: NextRequest) {
  const url = req.nextUrl;
  const rootUrl = getRootUrl();

  const ghUsername = DomainService.getGhUsernameFromRequest(req);
  const reservedSubdomain = DomainService.getReservedSubdomainFromRequest(req);
  const bareDomain = !ghUsername && !reservedSubdomain;
  const session = (await getToken({ req })) as any;
  const roleId = session?.user?.roleId;
  const searchParams = req.nextUrl.searchParams.toString();

  let path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;
  path = path === "/" ? "" : path;

  // exempt from middleware rewrites
  if (url.pathname.startsWith("/monitoring") || url.pathname.startsWith("/api/users/verify")) {
    return NextResponse.next();
  }

  // market.dev
  if (bareDomain) {
    if (url.pathname === "/terms" || url.pathname === "/privacy") {
      return NextResponse.next();
    }
    if (url.pathname === "/" || url.pathname.startsWith("/home")) {
      return rewrite(`/home${path}`, req.url);
    }

    // Redirect all other paths to explore.market.dev
    // @TODO: This should use an env var, not hardcoded hosts.
    const targetHost =
      process.env.NODE_ENV === "development" ? "localhost:4000" : "explore.market.dev";

    return NextResponse.redirect(
      `http${process.env.NODE_ENV === "development" ? "" : "s"}://${targetHost}${path}`,
      { status: 301 }
    );
  }

  // $GHUSERNAME.market.dev or any custom subdomain site
  // permit API from users' subdomains
  if (ghUsername) {
    if (url.pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    const maintainerSitePath = `/maintainer-site/${ghUsername}${path}`;
    return rewrite(maintainerSitePath, req.url);
  }

  // *.market.dev
  const loginPaths = ["/login", "/customer-login", "/login/local-auth"];

  // if you're on a login page and already signed in, kick you to /
  if (session && loginPaths.includes(url.pathname)) {
    const searchParams = url.searchParams.toString();
    const redirectUrl = new URL("/", req.url);
    if (searchParams) {
      redirectUrl.search = searchParams;
    }
    return NextResponse.redirect(redirectUrl);
  }

  // app.market.dev
  if (reservedSubdomain === "app" || DomainService.isVercelPreview(req)) {
    // if customer, then lock to /app/c/
    if (roleId === "customer") {
      if (url.pathname.startsWith("/checkout") || url.pathname.startsWith("/success")) {
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
