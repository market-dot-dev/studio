import { EchoService } from "@/app/services/echo-service";
import UserService, { getCurrentUser } from "@/app/services/UserService";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }

  const response = await EchoService.validateAccount();
  if (response.status === 404) {
    return new Response(JSON.stringify({ error: "Not an expert" }), {
      status: 404,
    });
  }

  if (response.status != 200) {
    return new Response(
      JSON.stringify({ error: "Failed to validate Echo account" }),
      {
        status: response.status,
      },
    );
  }

  const expert = await response.json();
  if (user) {
    await UserService.updateUser(user.id, {
      echoExpertId: expert.id.toString(),
    });
  }

  return NextResponse.json({
    status: "success",
    expert,
  });
}
