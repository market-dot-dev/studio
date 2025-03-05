import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import UserService from "@/app/services/UserService";
import { createSessionUser, SessionUser } from "@/app/models/Session";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user ID from the token
    const userObj = token.user as SessionUser;
    const userId = userObj.id;
    
    // Fetch the full user data
    const user = await UserService.findUser(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create a session user object with only the necessary information
    const sessionUser = createSessionUser(user);

    // Return the user data
    return NextResponse.json(sessionUser);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 