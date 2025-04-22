"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, ReactNode } from "react";

interface LoginButtonProps extends Omit<ButtonProps, "onClick"> {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}

export const LoginButton: FC<LoginButtonProps> = ({ children, onClick, href, ...props }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    // If no href provided, use the onClick handler
    if (!href) {
      onClick?.();
      return;
    }

    // Check if we have a callbackUrl in the current URL
    const callbackUrl = searchParams?.get("callbackUrl");
    if (callbackUrl) {
      // Append callbackUrl to the href
      const separator = href.includes("?") ? "&" : "?";
      router.push(`${href}${separator}callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    // Default navigation
    router.push(href);
  };

  return (
    <Button variant="outline" onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};
