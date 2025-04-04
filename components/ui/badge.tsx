import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const badgeVariants = cva(
  "inline-flex items-center border border-black/10 tracking-[-0.0075em] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-swamp focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary !text-primary-foreground shadow",
        secondary: "border-transparent bg-stone-200 !text-stone-600",
        success: "border-transparent bg-swamp !text-primary-foreground shadow",
        destructive:
          "border-transparent bg-destructive !text-destructive-foreground shadow",
        outline: "!text-stone-600",
        empty: "!text-stone-600 border-dashed border-black/20",
      },
      size: {
        default: "py-0.5 px-1.5 text-xs rounded-sm",
        sm: "py-0.5 px-1 text-xxs tracking-[-0.02em] rounded-[3px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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

export { Badge, badgeVariants }
