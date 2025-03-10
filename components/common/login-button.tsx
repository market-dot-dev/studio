"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, MouseEventHandler, FC } from "react";

interface LoginButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
  href?: string;
  preserveCallbackUrl?: boolean;
}

export const LoginButton: FC<LoginButtonProps> = ({
  children,
  onClick,
  isLoading,
  href,
  preserveCallbackUrl = true,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get callbackUrl from current URL if it exists
  const callbackUrl = preserveCallbackUrl ? searchParams?.get('callbackUrl') : null;
  
  // If we have both href and callbackUrl, append callbackUrl as a query parameter
  const finalHref = href && callbackUrl 
    ? `${href}${href.includes('?') ? '&' : '?'}callbackUrl=${encodeURIComponent(callbackUrl)}`
    : href;
  
  const loginOrNavigate = finalHref ? () => router.push(finalHref) : onClick;

  return (
    <button
      disabled={isLoading}
      onClick={loginOrNavigate}
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
