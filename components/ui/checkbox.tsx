"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, ...props }, ref) => {
  const checkbox = (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "relative peer h-4 w-4 shrink-0  rounded-sm border border-black/20 bg-white shadow-sm transition-[border-color,background-color] duration-100 ease-in-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-swamp disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-swamp data-[state=checked]:bg-swamp data-[state=checked]:text-primary-foreground",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center text-current")}
      >
        <Check strokeWidth={4.5} className="h-2.5 w-2.5 shrink-0" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (label) {
    return (
      <div className="flex items-center gap-2">
        {checkbox}
        <Label htmlFor={props.id} className="peer-disabled:opacity-50 font-medium">{label}</Label>
      </div>
    );
  }

  return checkbox;
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
