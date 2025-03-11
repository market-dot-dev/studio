"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, MouseEventHandler, FC } from "react";
import { Button } from "@/components/ui/button";

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
  const searchParams = useSearchParams();
  
  const handleClick = () => {
    // If no href provided, use the onClick handler
    if (!href) {
      onClick && onClick({} as any);
      return;
    }
    
    // Check if we have a callbackUrl in the current URL
    const callbackUrl = searchParams?.get('callbackUrl');
    if (callbackUrl) {
      // Append callbackUrl to the href
      const separator = href.includes('?') ? '&' : '?';
      router.push(`${href}${separator}callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }
    
    // Default navigation
    router.push(href);
  };

  return (
    <Button
      variant="outline"
      loading={isLoading}
      loadingText={loadingText}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Button>
  );
};

export default LoginButton;
