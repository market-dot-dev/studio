import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;


  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // special case for Vercel preview deployment URLs
  if (
    hostname.includes("---") &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split("---")[0]}.${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }`;
  }

  // special case, not processing any api calls except it is a maintainer's subdomain.
  if( url.pathname.startsWith('/api') &&
    (!(hostname !== process.env.NEXT_PUBLIC_ROOT_DOMAIN && hostname !== "localhost:3000") || hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)) {
    return NextResponse.next();
  }
  
  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // rewrites for app pages
  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    
    const session = await getToken({ req });
    const isLoginPath = path === "/login" || path === "/login/local-auth";

    if (!session && !isLoginPath) {
      return NextResponse.redirect(new URL("/login", req.url));
    } else if (session && path == "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, req.url),
    );
  }

  // Check if on a subdomain and handle login logic
  if (hostname !== process.env.NEXT_PUBLIC_ROOT_DOMAIN && hostname !== "localhost:3000") {

    if( path.startsWith('/api') ) {
      return NextResponse.rewrite(new URL(`/api/${hostname}${path.replace('/api', '')}`, req.url));
    }
    
    const session = await getToken({ req });

    // Redirect to login if not logged in and not already on login page
    if (!session && !path.startsWith("/login")) {
      return NextResponse.redirect(new URL(`/login${path}`, req.url));
    }

    // Redirect to home if logged in and on login page
    if (session && path.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // special case for `vercel.pub` domain
  if (hostname === "vercel.pub") {
    return NextResponse.redirect(
      "https://vercel.com/blog/platforms-starter-kit",
    );
  }

  // rewrite root application to `/home` folder
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(
      new URL(`/home${path === "/" ? "" : path}`, req.url),
    );
  }

  // rewrite everything else to `/[domain]/[slug] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
