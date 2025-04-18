"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    const checkbox = (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer relative h-4 w-4 shrink-0 rounded-sm border border-black/20 bg-white shadow-sm transition-[border-color,background-color] duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-swamp disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-black/30 data-[state=checked]:border-swamp data-[state=checked]:bg-swamp data-[state=checked]:text-primary-foreground group-hover:data-[state=checked]:border-swamp-500",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn(
            "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-current"
          )}
        >
          <Check strokeWidth={4.5} className="size-2.5 shrink-0" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    if (label) {
      return (
        <div className="group flex items-center gap-2">
          {checkbox}
          <Label htmlFor={props.id} className="font-medium peer-disabled:opacity-50">
            {label}
          </Label>
        </div>
      );
    }

    return checkbox;
  }
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
