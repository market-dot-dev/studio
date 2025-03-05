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
  "inline-flex items-center border border-black/10 tracking-[-0.0075em] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary !text-primary-foreground shadow",
        secondary:
          "border-transparent bg-stone-200 !text-stone-600",
        success:
          "border-transparent bg-marketing-swamp !text-primary-foreground shadow",
        destructive:
          "border-transparent bg-destructive !text-destructive-foreground shadow",
        outline: "text-foreground",
      },
      size: {
        default: "py-1 px-2 text-xs rounded-md",
        sm: "py-0.5 px-1 text-xxs tracking-[-0.02em] rounded",
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
  tooltipText?: string;
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
    <div className={className}>
      <Tooltip>{children}</Tooltip>
    </div>
  );
};

function Badge({ 
  className, 
  variant, 
  size,
  tooltipText, 
  tooltipSide = "top", 
  tooltipAlign = "center", 
  ...props 
}: BadgeProps) {
  const badgeClasses = cn(badgeVariants({ variant, size }), className);
  
  if (tooltipText) {
    return (
      <TooltipProvider>
        <StyledTooltip className={badgeClasses}>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center" {...props} />
          </TooltipTrigger>
          <TooltipContent side={tooltipSide} align={tooltipAlign}>
            {tooltipText}
          </TooltipContent>
        </StyledTooltip>
      </TooltipProvider>
    );
  }

  return <div className={badgeClasses} {...props} />;
}

export { Badge, badgeVariants }
