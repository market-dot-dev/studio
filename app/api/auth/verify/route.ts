import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";
import { SessionUser } from "@/app/models/Session";

/**
 * API endpoint for cross-domain session verification
 * 
 * This endpoint allows the Rails app (explore.market.dev) to verify
 * if a user has a valid session in the Next.js app (market.dev)
 * 
 * To use this endpoint from the Rails app:
 * 1. Get the session token cookie from the browser
 * 2. Send the token to this endpoint
 * 3. If the token is valid, this will return user information
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { token } = data;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 }
      );
    }

    // Manually verify the token
    const decoded = await getToken({
      req: {
        cookies: {
          [`${process.env.VERCEL_URL ? "__Secure-" : ""}next-auth.session-token`]: token,
        },
      } as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Extract user information from the token
    const user = decoded.user as SessionUser;

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found in token" },
        { status: 401 }
      );
    }

    // Return the necessary user information
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        roleId: user.roleId,
        // Add any other fields you need to share with the Rails app
      },
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Internal server error" 
      },
      { status: 500 }
    );
  }
} 