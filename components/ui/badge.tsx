import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border border-black/10 font-semibold tracking-[-0.0075em] transition-colors focus:outline-none focus:ring-2 focus:ring-swamp focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary !text-primary-foreground shadow",
        secondary: "border-transparent bg-stone-200 !text-stone-600",
        success: "border-transparent bg-swamp !text-primary-foreground shadow",
        destructive: "border-transparent bg-destructive !text-destructive-foreground shadow",
        outline: "!text-stone-600"
      },
      size: {
        default: "rounded-sm px-1.5 py-0.5 text-xs",
        sm: "rounded-[3px] px-1 py-0.5 text-xxs tracking-[-0.02em]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  tooltip?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
}

// Custom StyledTooltip component that accepts className
interface StyledTooltipProps {
  className?: string;
  children: React.ReactNode;
}

const StyledTooltip: React.FC<StyledTooltipProps> = ({ className, children }) => {
  return (
    <div className={cn("cursor-default", className)}>
      <Tooltip>{children}</Tooltip>
    </div>
  );
};

function Badge({
  className,
  variant,
  size,
  tooltip,
  tooltipSide = "top",
  tooltipAlign = "center",
  ...props
}: BadgeProps) {
  const badgeClasses = cn(badgeVariants({ variant, size }), className);

  if (tooltip) {
    return (
      <TooltipProvider>
        <StyledTooltip className={badgeClasses}>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center" {...props} />
          </TooltipTrigger>
          <TooltipContent side={tooltipSide} align={tooltipAlign}>
            {tooltip}
          </TooltipContent>
        </StyledTooltip>
      </TooltipProvider>
    );
  }

  return <div className={badgeClasses} {...props} />;
}

export { Badge, badgeVariants };
