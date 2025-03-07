"use client";

import { useRouter } from "next/navigation";
import { ReactNode, MouseEventHandler, FC } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoginButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
  href?: string;
  loadingText?: string;
  className?: string;
}

export const LoginButton: FC<LoginButtonProps> = ({
  children,
  onClick,
  isLoading,
  loadingText,
  href,
  className = ""
}) => {
  const router = useRouter();
  const loginOrNavigate = href ? () => router.push(href) : onClick;

  return (
    <Button
      variant="outline"
      disabled={isLoading}
      loading={isLoading}
      loadingText={loadingText}
      onClick={loginOrNavigate}
      className={className}
    >
      {children}
    </Button>
  );
};

export default LoginButton;
