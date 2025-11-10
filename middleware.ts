import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isHomePagePath, isPublicPath } from "./app/services/public-path-service";
import {
  getGhUsernameFromRequest,
  getHostnameFromRequest,
  getReservedSubdomainFromRequest,
  isVercelPreview
} from "./app/services/site/domain-request-service";
import { SessionUser } from "./types/session";

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

/**
 * This is the main middleware entry point. It follows a simple "decision tree" logic:
 * it checks for the most specific domain case first, handles it, and returns.
 * If no specific domain rule matches, it falls through to the default behavior.
 */
export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const path = req.nextUrl.pathname;
    const host = (await getHostnameFromRequest(req))?.toLowerCase();
    const sessionUser = req.nextauth.token?.user as SessionUser | undefined;

    // Helper constants for domain names, makes it easy to change later
    const isDevelopment = process.env.NODE_ENV === "development";
    const APP_HOST = isDevelopment ? "app.market.local:3000" : "app.market.dev";
    const HOMEPAGE_HOST = isDevelopment ? "studio.market.local:3000" : "studio.market.dev";
    const SITES_HOST = isDevelopment ? "sites.market.local:3000" : "sites.market.dev";

    if (host === SITES_HOST) {
      if (path.startsWith("/api")) {
        return NextResponse.next();
      }

      const segments = path.split("/").filter(Boolean);
      const [handle, ...rest] = segments;

      if (!handle) {
        const redirectUrl = new URL(req.url);
        redirectUrl.host = HOMEPAGE_HOST;
        redirectUrl.pathname = "/";
        return NextResponse.redirect(redirectUrl);
      }

      const remainingPath = rest.length > 0 ? `/${rest.join("/")}` : "";
      const rewritePath = `/maintainer-site/${handle}${remainingPath}${req.nextUrl.search}`;

      return NextResponse.rewrite(new URL(rewritePath, req.url));
    }

    // --- Decision 1: Is this the main "app" subdomain? ---
    const reservedSubdomain = await getReservedSubdomainFromRequest(req);
    const isAppDomain = reservedSubdomain === "app" || (await isVercelPreview(req));

    if (isAppDomain) {
      // Always allow API routes on the app domain to pass through.
      if (path.startsWith("/api")) {
        return NextResponse.next();
      }

      // Apply authorization rules for authenticated users.
      if (sessionUser) {
        const hasNoOrg = !sessionUser.currentOrgId;
        const isCustomerPortal =
          path === "/c" ||
          path.startsWith("/c/") ||
          path === "/success" ||
          path.startsWith("/checkout/");
        const isOrgCreationPage = path === "/organizations";
        const isAccessingVendorArea = !isCustomerPortal && !isOrgCreationPage;

        if (hasNoOrg && isAccessingVendorArea) {
          // This user is not allowed here. Redirect them and STOP.
          return NextResponse.redirect(new URL("/organizations", req.url));
        }
      }

      // If authorized, rewrite to the internal /app directory.
      return NextResponse.rewrite(new URL(`/app${path}${req.nextUrl.search}`, req.url));
    }

    // --- Decision 2: Is this a GitHub username subdomain? ---
    const ghUsername = await getGhUsernameFromRequest(req);
    if (ghUsername) {
      // Always allow API routes on maintainer sites to pass through.
      // @TG-NOTE: Do we actually need this? Are there API's on the maintainer-site?
      if (path.startsWith("/api")) {
        return NextResponse.next();
      }
      // Rewrite to the maintainer site directory.
      return NextResponse.rewrite(
        new URL(`/maintainer-site/${ghUsername}${path}${req.nextUrl.search}`, req.url)
      );
    }

    // --- Decision 3: Is this the "studio" subdomain? ---
    if (reservedSubdomain === "studio") {
      // Always allow API routes on studio to pass through.
      if (path.startsWith("/api")) {
        return NextResponse.next();
      }

      // Keep home pages on studio
      if (await isHomePagePath(path)) {
        return NextResponse.rewrite(
          new URL(`/home${path === "/" ? "" : path}${req.nextUrl.search}`, req.url)
        );
      }

      // Redirect everything else to the app host to avoid duplicate app surface
      {
        const redirectUrl = new URL(req.url);
        redirectUrl.host = APP_HOST;
        return NextResponse.redirect(redirectUrl);
      }
    }

    // --- Decision 4: This is the bare domain or another reserved subdomain ---

    // Redirect /login paths on non-app hosts to the app subdomain.
    if (path.startsWith("/login")) {
      const redirectUrl = new URL(req.url);
      redirectUrl.host = APP_HOST;
      return NextResponse.redirect(redirectUrl);
    }

    // Home, terms, privacy should live on studio; redirect there from non-studio hosts
    if (await isHomePagePath(path)) {
      const redirectUrl = new URL(req.url);
      redirectUrl.host = HOMEPAGE_HOST;
      return NextResponse.redirect(redirectUrl);
    }

    // For any other path on the bare domain, you might want to redirect
    // to an explore page or the main app.
    const rewriteUrl = `/app${path}${req.nextUrl.search}`;
    return NextResponse.rewrite(new URL(rewriteUrl, req.url));
  },
  {
    callbacks: {
      authorized: async ({ req, token }) => {
        // Check if this is a GitHub username subdomain - these are always public
        const ghUsername = await getGhUsernameFromRequest(req);
        if (ghUsername) {
          return true;
        }

        const currentHost = (await getHostnameFromRequest(req))?.toLowerCase();
        const isDevelopment = process.env.NODE_ENV === "development";
        const sitesHost = isDevelopment ? "sites.market.local:3000" : "sites.market.dev";
        if (currentHost === sitesHost) {
          return true;
        }

        // Check if the path is in the public paths list
        if (await isPublicPath(req.nextUrl.pathname)) {
          return true;
        }

        // Otherwise, require authentication
        return !!token;
      }
    }
  }
);
