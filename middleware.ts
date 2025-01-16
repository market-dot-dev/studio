import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import RoleService, { Role } from "./app/services/role-service";
import DomainService from "./app/services/domain-service";
import { SessionUser } from "./app/models/Session";
import { getRootUrl } from "./lib/domain";

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
  const rootUrl = getRootUrl();

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

  // gitwallet.co
  if (bareDomain || reservedSubdomain === "sell") {
    if (url.pathname.startsWith("/design")) {
      return rewrite(`/design${path}`, req.url);
    }
    if (url.pathname === "/terms" || url.pathname === "/privacy") {
      return NextResponse.next();
    }
    return rewrite(`/home${path}`, req.url);
  }

  // $GHUSERNAME.gitwallet.co
  // permit API from users' subdomains
  if (!!ghUsername) {
    if (url.pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    return rewrite(`/maintainer-site/${ghUsername}${path}`, req.url);
  }

  // *.gitwallet.co
  const loginPaths = ["/login", "/customer-login", "/login/local-auth"];

  // if you're on a login page and already signed in, kick you to /
  if (session && loginPaths.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // app.gitwallet.co
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
