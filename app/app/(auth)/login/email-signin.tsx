import { LoginButton } from "@/components/common/login-button";
import { LucideMail } from "lucide-react";
import Link from "next/link";

export const EmailSignIn = ({ callbackUrl }: { callbackUrl: string }) => {
  const otpUrl = `/login/otp${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`;

  return (
    <Link href={otpUrl} passHref>
      <LoginButton>
        <LucideMail />
        Continue with Email
      </LoginButton>
    </Link>
  );
};
