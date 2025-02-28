import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionUser } from "@/app/models/Session";

/**
 * API endpoint for cross-domain session verification using cookies
 * 
 * This endpoint allows the Rails app to verify if a user has a valid session
 * by examining the session cookie directly. This is useful when the Rails app
 * can access the same cookie domain (via a shared parent domain).
 */
export async function GET(req: NextRequest) {
  try {
    // Get the session from the request
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "No valid session found" },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': 'https://explore.market.dev',
            'Access-Control-Allow-Credentials': 'true',
          }
        }
      );
    }
    
    // Cast the session user to include our custom fields
    const user = session.user as any as SessionUser;
    
    // Return the user information
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          roleId: user.roleId,
          // Add any other fields needed by the Rails app
        },
      },
      {
        headers: {
          'Access-Control-Allow-Origin': 'https://explore.market.dev',
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    );
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Internal server error" 
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'https://explore.market.dev',
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': 'https://explore.market.dev',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    }
  );
} 