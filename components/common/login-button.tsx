"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, MouseEventHandler, FC } from "react";

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
    <button
      disabled={isLoading}
      onClick={handleClick}
      className={`${
        isLoading
          ? "cursor-not-allowed bg-white dark:bg-black"
          : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:bg-black dark:hover:shadow"
      } group flex h-12 w-full items-center justify-center gap-3 rounded-md font-bold text-stone-900 shadow ring-1 ring-black/5 transition-colors duration-75 focus:outline-none dark:border-stone-700 dark:text-stone-400`}
    >
      {isLoading ? <LoadingDots color="#A8A29E" /> : children}
    </button>
  );
};

export default LoginButton;
