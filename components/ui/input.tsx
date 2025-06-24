import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  icon?: React.ReactNode;
  suffix?: string | React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, suffix, ...props }, ref) => {
    return (
      <div
        className={cn("relative flex w-full items-center", suffix && "shadow-border-sm rounded")}
      >
        {icon && (
          <span className="absolute left-2.5 top-1/2 inline-flex h-9 -translate-y-1/2 items-center whitespace-nowrap rounded-l bg-white px-3 text-sm text-muted-foreground md:h-8 [&>svg]:size-4">
            {icon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "relative flex h-9 w-full rounded border-none border-border bg-white px-3 text-base transition-[box-shadow,text-color] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swamp disabled:cursor-not-allowed disabled:opacity-50 md:h-8 md:text-sm",
            suffix
              ? "rounded-r-none shadow-none hover:shadow-border-sm"
              : "shadow-border-sm hover:shadow-border",
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <span className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-r bg-white px-3 text-sm text-muted-foreground md:h-8 [&>svg]:size-4">
            {suffix}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
