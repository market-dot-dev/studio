"use client";

import { useRouter } from "next/navigation";
import { ReactNode, MouseEventHandler, FC } from "react";
import { Button } from "@/components/ui/button";

interface LoginButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
  href?: string;
}

export const LoginButton: FC<LoginButtonProps> = ({
  children,
  onClick,
  isLoading,
  href,
}) => {
  const router = useRouter();
  const loginOrNavigate = href ? () => router.push(href) : onClick;

  return (
    <Button variant="outline" disabled={isLoading} loading={isLoading} onClick={loginOrNavigate}>
      {children}
    </Button>
  );
};

export default LoginButton;
