"use client";

import { LoginButton } from "@/components/common/login-button";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const GoogleSignIn = ({ callbackUrl }: { callbackUrl: string }) => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    if (error) console.log("google error", error);
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    if (errorMessage) toast.error(errorMessage);
  }, [error]);

  const handleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <LoginButton onClick={handleLogin} loading={loading} loadingText="Connecting to Google">
      <SiGoogle />
      Continue with Google
    </LoginButton>
  );
};
