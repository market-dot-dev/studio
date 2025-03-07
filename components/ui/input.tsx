import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  iconColor?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      icon,
      iconPosition = "left",
      iconColor = "text-stone-500",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="relative flex w-full items-center">
        {icon && iconPosition === "left" && (
          <div
            className={cn(
              "pointer-events-none absolute left-3 flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4",
              iconColor,
            )}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded border-none bg-white px-3 text-base shadow-border transition-[box-shadow,text-color] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swamp disabled:cursor-not-allowed disabled:opacity-50 md:h-8 md:text-sm",
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            className,
          )}
          ref={ref}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <div className={cn(
            "pointer-events-none absolute right-3 flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4",
            iconColor,
          )}
          >
            {icon}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
