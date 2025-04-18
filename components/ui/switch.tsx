"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label?: string;
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, label, ...props }, ref) => {
    const switchComponent = (
      <SwitchPrimitives.Root
        className={cn(
          "peer inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swamp focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-swamp data-[state=unchecked]:bg-stone-300",
          className
        )}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            "border-shadow pointer-events-none block h-3 w-3 rounded-full bg-background ring-0 transition-transform ease-in-out data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0"
          )}
        />
      </SwitchPrimitives.Root>
    );

    if (label) {
      return (
        <div className="flex items-center gap-2">
          {switchComponent}
          <Label htmlFor={props.id} className="font-medium peer-disabled:opacity-50">
            {label}
          </Label>
        </div>
      );
    }

    return switchComponent;
  }
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
