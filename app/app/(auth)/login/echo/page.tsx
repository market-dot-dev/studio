import { getCurrentUser } from "@/app/services/UserService";
import { Button } from "@tremor/react";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";

// TODO: Update styling
export default async function EchoLoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  // If echo user id is already set, redirect to onboarding or home
  const currentUser = await getCurrentUser();
  if (currentUser?.echoUserId) {
    redirect("/");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Echo + GitWallet</h1>
      <p className="text-lg text-gray-600">
        Let's get you onboarded onto GitWallet to start selling your serivces.
      </p>
      <Button>Continue</Button>
    </div>
  );
}
