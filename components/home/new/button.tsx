import clsx from 'clsx';
import React from 'react'

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'ghost';
  className?: string;
}

export default function Button({ children, onClick, className, variant = 'default', ...props }: ButtonProps) {
  if (variant === 'ghost') {
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
        "text-marketing-primary text-marketing-base flex w-fit items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-marketing-camo px-8 py-3 transition-all duration-100 hover:brightness-[105%] active:scale-[98%] active:brightness-[101%]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
