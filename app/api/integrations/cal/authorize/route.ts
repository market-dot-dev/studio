import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";

// Cal.com OAuth settings
const CAL_OAUTH_CLIENT_ID = process.env.CAL_CLIENT_ID as string;
const CAL_REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/integrations/cal/callback`;
const CAL_AUTHORIZE_URL = "https://app.cal.com/auth/oauth2/authorize";

export async function GET(req: NextRequest) {
  console.log("[Cal.com Auth] Starting authorization flow");
  console.log("[Cal.com Auth] Environment check:", {
    hasClientId: !!CAL_OAUTH_CLIENT_ID,
    redirectUri: CAL_REDIRECT_URI,
    appUrl: process.env.NEXTAUTH_URL,
  });

  if (!CAL_OAUTH_CLIENT_ID) {
    console.error("[Cal.com Auth] Missing CAL_CLIENT_ID");
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings?error=cal_initialization_failed`
    );
  }

  const session = await getSession();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Generate a random state parameter to prevent CSRF attacks
  const state = nanoid();
  console.log("[Cal.com Auth] Generated state:", state);

  // Store the state in a cookie for verification in the callback
  cookies().set("cal_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
  });

  // Construct the authorization URL
  const authUrl = new URL(CAL_AUTHORIZE_URL);
  authUrl.searchParams.append("client_id", CAL_OAUTH_CLIENT_ID);
  authUrl.searchParams.append("redirect_uri", CAL_REDIRECT_URI);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("scope", "READ_BOOKING,READ_PROFILE");

  console.log("[Cal.com Auth] Constructed auth URL:", {
    url: authUrl.toString(),
    params: Object.fromEntries(authUrl.searchParams),
  });

  // Redirect to Cal.com's authorization page
  const cookieResponse = NextResponse.redirect(authUrl.toString());

  return cookieResponse;
} 