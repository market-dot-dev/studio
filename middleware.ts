import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { OrganizationType } from "./app/generated/prisma";
import { canViewPath, createAuthContext } from "./app/services/organization/role-service";
import {
  getGhUsernameFromRequest,
  getReservedSubdomainFromRequest,
  getSubdomainFromRequest,
  isVercelPreview
} from "./app/services/site/domain-request-service";
import { SessionUser } from "./lib/session-helper";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - error monitoring via Sentry (error-monitoring)
     * - platform webhooks (api/platform/*)
     * - external webhooks (api/webhook/*)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|api/webhook/|api/platform/|error-monitoring|[\\w-]+\\.\\w+).*)"
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
        const path = req.nextUrl.pathname;

        // Allow access if this is a site subdomain (GitHub username or custom subdomain)
        const subdomain = await getSubdomainFromRequest(req);
        const isReservedSubdomain = await getReservedSubdomainFromRequest(req);

        // If this is a subdomain that isn't reserved, it's a site subdomain that should be publicly accessible
        if (subdomain && !isReservedSubdomain) {
          return true;
        }

        // Create auth context from session
        const authContext = await createAuthContext(
          !!user?.id,
          user?.currentOrgType,
          user?.currentUserRole
        );

        // Get subdomain for context
        const currentSubdomain = await getReservedSubdomainFromRequest(req);

        return await canViewPath(path, authContext, currentSubdomain || undefined);
      }
    }
  }
);

const rewrite = (path: string, url: string) => {
  return NextResponse.rewrite(new URL(path, url));
};

async function customMiddleware(req: NextRequest) {
  const url = req.nextUrl;

  const ghUsername = await getGhUsernameFromRequest(req);
  const reservedSubdomain = await getReservedSubdomainFromRequest(req);
  const bareDomain = !ghUsername && !reservedSubdomain;

  // Extract session data with proper typing
  const token = await getToken({ req });
  const sessionUser = token?.user as SessionUser | undefined;
  const organizationType = sessionUser?.currentOrgType;

  const searchParams = req.nextUrl.searchParams.toString();
  let path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;
  path = path === "/" ? "" : path;

  // Skip middleware for monitoring and verification
  if (url.pathname.startsWith("/monitoring") || url.pathname.startsWith("/api/users/verify")) {
    return NextResponse.next();
  }

  // Handle bare domain (market.dev)
  if (bareDomain) {
    if (url.pathname === "/terms" || url.pathname === "/privacy") {
      return NextResponse.next();
    }
    if (url.pathname === "/" || url.pathname.startsWith("/home")) {
      return rewrite(`/home${path}`, req.url);
    }

    // Redirect to explore.market.dev
    const targetHost =
      process.env.NODE_ENV === "development" ? "localhost:4000" : "explore.market.dev";
    return NextResponse.redirect(
      `http${process.env.NODE_ENV === "development" ? "" : "s"}://${targetHost}${path}`,
      { status: 301 }
    );
  }

  // Handle GitHub username subdomains (johndoe.market.dev)
  if (ghUsername) {
    if (url.pathname.startsWith("/api")) {
      return NextResponse.next();
    }
    return rewrite(`/maintainer-site/${ghUsername}${path}`, req.url);
  }

  // Handle login redirects
  const loginPaths = ["/login", "/customer-login", "/login/local-auth"];
  if (sessionUser && loginPaths.includes(url.pathname)) {
    const redirectUrl = new URL("/", req.url);
    if (searchParams) {
      redirectUrl.search = searchParams;
    }
    return NextResponse.redirect(redirectUrl);
  }

  // Handle app subdomain (app.market.dev)
  if (reservedSubdomain === "app" || (await isVercelPreview(req))) {
    // Always allow API routes
    if (url.pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    // Customer organization routing
    if (organizationType === OrganizationType.CUSTOMER) {
      // Payment flows go to /app/
      if (url.pathname.startsWith("/checkout") || url.pathname.startsWith("/success")) {
        return rewrite(`/app${path}`, req.url);
      }
      // Everything else goes to /app/c/
      return rewrite(`/app/c${path}`, req.url);
    }

    // All other users (vendors, unauthenticated) get /app/
    return rewrite(`/app${path}`, req.url);
  }
}
