import { getCurrentUser } from "@/app/services/UserService";
import { NextResponse } from "next/server";

const API_ENDPOINT = process.env.ECHO_API_ENDPOINT;
const API_KEY = process.env.ECHO_API_KEY;

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.gh_username) {
    throw new Error("User GitHub username not found");
  }

  const response = await fetch(`${API_ENDPOINT}experts/${user.gh_username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (response.status === 404) {
    return new Response(JSON.stringify({ error: "Not an expert" }), {
      status: 404,
    });
  }

  const expert = await response.json();
  console.log("expert", expert);
  //   if (response.status === 200) {
  //     const expert = await response.json();

  //     if (user) {
  //       await UserService.updateUser(user.id, {
  //         echoExpertId: expert.id,
  //       });
  //     }
  //   }

  return NextResponse.json({
    status: "success",
    expert,
  });
}
