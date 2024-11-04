import clsx from 'clsx';
import React from 'react'

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void | ((e: any) => void) ;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'base';
  className?: string;
}

export default function Button({
  children,
  onClick,
  className,
  variant = "primary",
  size = "base",
  ...props
}: ButtonProps) {
  if (variant === "ghost") {
    return (
      <button
        onClick={onClick}
        className={clsx(
          `text-marketing-primary hover:bg-marketing-accent active:bg-marketing-accent-active focus-visible:ring-marketing-camo relative p-4 rounded-[5px] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[98%] -m-2`,
          className,
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
        "flex w-fit items-center justify-center gap-3 whitespace-nowrap rounded-lg transition-all duration-200",
        variant === "primary" &&
          "text-marketing-primary from-marketing-camo/75 via-marketing-camo/[92%] to-marketing-camo shadow-marketing-camo/40 bg-gradient-to-b shadow-md ring-1 ring-black/[20%] active:shadow",
        variant === "secondary" &&
          "text-marketing-primary bg-marketing-accent hover:bg-marketing-accent-active",
        variant === "link"
          ? "text-marketing-secondary hover:text-marketing-primary focus:text-marketing-primary"
          : "px-5 py-3 hover:brightness-[103%] active:scale-[98%] active:brightness-[101%]",
        size === "sm" ? "text-marketing-sm" : "text-marketing-base",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
