import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import RoleService from "./app/services/role-service";
import DomainService from "./app/services/domain-service";

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
        return true;
        //return await RoleService.canViewPath(req.nextUrl.pathname, (token as any)?.user?.roleId);
      }
    },
  }
);

const rewrite = (path: string, url: string) => {
  return NextResponse.rewrite(new URL(path, url));
}

async function customMiddleware(req: NextRequest) {
  const url = req.nextUrl;

  const hostname = DomainService.getHostnameFromRequest(req);
  const rootUrl = DomainService.getRootUrl();

  const ghUsername = DomainService.getGhUsernameFromRequest(req);
  const reservedSubdomain = DomainService.getReservedSubdomainFromRequest(req);
  const bareDomain = !ghUsername && !reservedSubdomain;
  const session = await getToken({ req }) as any;
  const signedIn = !!session;
  const roleId = session?.user?.roleId;
  const hostUrl = DomainService.getRootUrlFromRequest(req)

  const searchParams = req.nextUrl.searchParams.toString();

  let path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;
  path = path === "/" ? "" : path;

  // vercel.pub
  if (hostname === "vercel.pub") {
    return NextResponse.redirect(
      "https://vercel.com/blog/platforms-starter-kit",
    );
  }

  // alpha.gitwallet.co
  if(reservedSubdomain === 'alpha') {
    return rewrite(`/alpha${path}`, req.url);
  }

  // gitwallet.co
  if (bareDomain) {
    return rewrite(`/home${path}`, req.url);
  }

  // $GHUSERNAME.gitwallet.co
    // permit API from users' subdomains
  if(!!ghUsername) {
    if( url.pathname.startsWith('/api')) {
      return NextResponse.next();
    }

    return rewrite(`/maintainer-site/${ghUsername}${path}`, req.url);
  }

  // app.gitwallet.co
  if (reservedSubdomain === 'app') {
    // if customer, then lock to /app/c/
    if(roleId === 'customer' ) {
      return rewrite(`/app/c${path}`, req.url);
    } 

    if( url.pathname.startsWith('/api')) {
      return NextResponse.next();
    }

    // else lock to /app/
    return rewrite(`/app${path}`, req.url);
  }

  // *.gitwallet.co
  const loginPaths = ["/login", "/customer-login", "/login/local-auth"];

  // if you're on a login page and already signed in, kick you to /
  if (session && loginPaths.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
