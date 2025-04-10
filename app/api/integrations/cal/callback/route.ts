import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Cal.com OAuth settings
const CAL_OAUTH_CLIENT_ID = process.env.CAL_CLIENT_ID as string;
const CAL_OAUTH_CLIENT_SECRET = process.env.CAL_CLIENT_SECRET as string;
const CAL_REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/integrations/cal/callback`;
const CAL_TOKEN_URL = "https://app.cal.com/api/auth/oauth/token";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    // Check for errors in the callback
    if (error) {
      console.error("Cal.com OAuth error:", error);
      return NextResponse.redirect(
        new URL(`/settings/integrations?error=${error}`, req.url)
      );
    }

    // Verify state parameter to prevent CSRF attacks
    const storedState = req.cookies.get("cal_oauth_state")?.value;
    if (!storedState || storedState !== state) {
      console.error("Cal.com OAuth state mismatch");
      return NextResponse.redirect(
        new URL("/settings/integrations?error=invalid_state", req.url)
      );
    }

    if (!code) {
      console.error("Missing authorization code");
      return NextResponse.redirect(
        new URL("/settings/integrations?error=missing_code", req.url)
      );
    }

    // Exchange the authorization code for access and refresh tokens
    const tokenResponse = await fetch(CAL_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: CAL_OAUTH_CLIENT_ID,
        client_secret: CAL_OAUTH_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: CAL_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Failed to exchange code for tokens:", errorData);
      return NextResponse.redirect(
        new URL("/settings/integrations?error=token_exchange_failed", req.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token } = tokenData;

    // Calculate token expiry time (default to 1 hour from now if not provided)
    const expiresIn = tokenData.expires_in || 3600;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // Store the tokens in the database
    await prisma.calIntegration.upsert({
      where: {
        userId: session.user.id,
      },
      create: {
        userId: session.user.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
      },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
      },
    });

    // Clear the state cookie
    const response = NextResponse.redirect(
      new URL("/settings/integrations?success=true", req.url)
    );
    response.cookies.set("cal_oauth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Error processing Cal.com OAuth callback:", error);
    return NextResponse.redirect(
      new URL("/settings/integrations?error=callback_processing_failed", req.url)
    );
  }
} 