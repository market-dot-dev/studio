"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { useRouter } from "next/navigation";
import { ReactNode, MouseEventHandler, FC } from "react";

interface LoginButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
  href?: string;
}

export const LoginButton: FC<LoginButtonProps> = ({ children, onClick, isLoading, href }) => {
  const router = useRouter();
  const loginOrNavigate = href ? () => router.push(href) : onClick;

  return (
    <button
      disabled={isLoading}
      onClick={loginOrNavigate}
      className={`${
        isLoading
          ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
          : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
      } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
    >
      {isLoading ? (
        <LoadingDots color="#A8A29E" />
      ) : (
        children
      )}
    </button>
  );
};

export default LoginButton;