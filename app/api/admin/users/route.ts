import UserService from "@/app/services/UserService";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Check admin permissions
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized - Please sign in to access this resource" },
        { status: 401 }
      );
    }

    // For testing purposes, we can comment out the admin check to see users
    // In production, this should always be enabled

    // Cast the session user to include our custom fields
    const user = session.user as any; // Using 'any' to avoid TypeScript errors

    console.log("User session for admin/users API:", {
      hasRoleId: !!user?.roleId,
      roleId: user?.roleId || "undefined"
    });

    // Verify user is an admin
    if (user?.roleId !== "admin") {
      return NextResponse.json({ message: "Forbidden - Admin access required" }, { status: 403 });
    }

    // Use the UserService to get all users
    const users = await UserService.getCustomersMaintainers();

    if (!users || !Array.isArray(users)) {
      console.error("UserService.getCustomersMaintainers() returned invalid data", users);
      return NextResponse.json(
        { message: "Failed to retrieve users - Invalid data format" },
        { status: 500 }
      );
    }

    console.log(`Retrieved ${users.length} users from UserService`);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
