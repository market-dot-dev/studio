import { NextRequest, NextResponse } from "next/server";

// Mock user data
const MOCK_USERS = [
  {
    id: "user_1",
    name: "John Doe",
    email: "tarun@market.dev",
    roleId: "maintainer"
  },
  {
    id: "user_2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    roleId: "customer"
  },
  {
    id: "user_3",
    name: "Admin User",
    email: "admin@example.com",
    roleId: "admin"
  },
  {
    id: "user_4",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    roleId: "maintainer"
  },
  {
    id: "user_5",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    roleId: "customer"
  }
];

export async function GET(req: NextRequest) {
  // Simulate a delay to test loading states
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(MOCK_USERS);
}
