import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Cal.com OAuth settings
const CAL_OAUTH_CLIENT_ID = process.env.CAL_CLIENT_ID as string;
const CAL_OAUTH_CLIENT_SECRET = process.env.CAL_CLIENT_SECRET as string;
const CAL_REFRESH_TOKEN_URL = "https://app.cal.com/api/auth/oauth/refreshToken";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user's Cal.com integration
    const calIntegration = await prisma.calIntegration.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!calIntegration) {
      return NextResponse.json(
        { error: "Cal.com integration not found" },
        { status: 404 }
      );
    }

    // Refresh the access token
    const tokenResponse = await fetch(CAL_REFRESH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: CAL_OAUTH_CLIENT_ID,
        client_secret: CAL_OAUTH_CLIENT_SECRET,
        refresh_token: calIntegration.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Failed to refresh Cal.com token:", errorData);
      return NextResponse.json(
        { error: "Failed to refresh token" },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Calculate token expiry time (default to 1 hour from now if not provided)
    const expiresIn = tokenData.expires_in || 3600;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // Update the access token in the database
    await prisma.calIntegration.update({
      where: {
        userId: session.user.id,
      },
      data: {
        accessToken: access_token,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error refreshing Cal.com token:", error);
    return NextResponse.json(
      { error: "Failed to refresh Cal.com token" },
      { status: 500 }
    );
  }
} 