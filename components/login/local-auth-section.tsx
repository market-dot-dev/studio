"use client";

import { useLocalAuthAvailable } from "@/app/config/local-auth";
import { LoginButton } from "@/components/common/login-button";
import { Suspense } from "react";

export default function LocalAuthSection() {
  // Use the client-side hook
  const isLocalAuthAvailable = useLocalAuthAvailable();

  if (!isLocalAuthAvailable) {
    return null;
  }

  return (
    <Suspense>
      <LoginButton href={"/login/local-auth"} loading={false} className="w-full">
        Log in with Local Auth
      </LoginButton>
    </Suspense>
  );
}
