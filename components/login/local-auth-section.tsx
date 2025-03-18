'use client';

import { Suspense } from "react";
import LoginButton from "@/components/common/login-button";
import { useLocalAuthAvailable } from "@/app/config/local-auth";

export default function LocalAuthSection() {
  // Use the client-side hook
  const isLocalAuthAvailable = useLocalAuthAvailable();
  
  if (!isLocalAuthAvailable) {
    return null;
  }
  
  return (
    <Suspense>
      <LoginButton
        href={"/login/local-auth"}
        isLoading={false}
        className="w-full"
      >
        Log in with Local Auth
      </LoginButton>
    </Suspense>
  );
} 