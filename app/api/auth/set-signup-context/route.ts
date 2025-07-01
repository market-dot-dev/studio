import { getRootUrl } from "@/lib/domain";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const context = searchParams.get("context");
  const callbackUrl = searchParams.get("callbackUrl");

  // Set context cookie if provided
  if (context) {
    (cookies() as any).set("signup_context", context, {
      maxAge: 60 * 10, // 10 minutes
      httpOnly: true,
      domain: `.${process.env.NEXT_PUBLIC_ROOT_HOST}`,
      sameSite: "lax"
    });
  }

  // Build redirect URL to login page using getRootUrl
  const loginUrl = getRootUrl("app", "/login");
  const redirectUrl = new URL(loginUrl);
  if (callbackUrl) {
    redirectUrl.searchParams.set("callbackUrl", callbackUrl);
  }

  return NextResponse.redirect(redirectUrl);
}
