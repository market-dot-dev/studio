import clsx from "clsx";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void | ((e: any) => void);
  variant?: "primary" | "secondary" | "ghost" | "link";
  size?: "sm" | "base";
  fullWidth?: boolean;
  className?: string;
}

export function MarketingButton({
  children,
  onClick,
  className,
  variant = "primary",
  size = "base",
  fullWidth = false,
  ...props
}: ButtonProps) {
  if (variant === "ghost") {
    return (
      <button
        onClick={onClick}
        className={clsx(
          `relative -m-2 rounded-[5px] p-4 text-marketing-primary transition-colors duration-100 hover:bg-marketing-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marketing-camo-accent focus-visible:ring-offset-2 active:scale-[98%] active:bg-marketing-accent-active`,
          fullWidth ? "w-full" : "w-fit",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center gap-2.5 whitespace-nowrap rounded-lg text-marketing-sm transition-all duration-200 md:gap-3 md:text-marketing-base",
        variant === "primary" &&
          "shadow-marketing-camo/40 bg-gradient-to-b from-marketing-camo/75 via-marketing-camo/[92%] to-marketing-camo text-marketing-primary shadow-md ring-1 ring-black/[20%] active:shadow",
        variant === "secondary" &&
          "bg-marketing-accent text-marketing-primary hover:bg-marketing-accent-active",
        variant === "link"
          ? "text-marketing-secondary hover:text-marketing-primary focus:text-marketing-primary"
          : "px-4 py-2.5 hover:brightness-[103%] active:scale-[98%] active:brightness-[101%] md:px-5 md:py-3",
        size === "sm" ? "text-marketing-sm" : "text-marketing-base",
        fullWidth ? "w-full" : "w-fit",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
