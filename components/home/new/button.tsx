import clsx from 'clsx';
import React from 'react'

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export default function Button({
  children,
  onClick,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  if (variant === "ghost") {
    return (
      <button
        onClick={onClick}
        className={clsx(
          `text-marketing-primary hover:bg-marketing-accent active:bg-marketing-accent-active focus-visible:ring-marketing-camo relative h-8 w-8 rounded-[5px] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[98%]`,
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
        "text-marketing-primary text-marketing-base flex w-fit items-center justify-center gap-3 whitespace-nowrap rounded-lg px-5 py-3 transition-all duration-200 hover:brightness-[103%] active:scale-[98%] active:brightness-[101%]",
        variant === "secondary" ? "bg-marketing-accent hover:bg-marketing-accent-active" : 'bg-gradient-to-b from-marketing-camo/80 to-marketing-camo ring-1 ring-black/[23%] shadow',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
