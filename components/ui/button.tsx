import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-swamp disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&[data-loading=true]_svg:not(.loading-spinner)]:hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-primary/90 to-primary text-primary-foreground shadow-border hover:bg-primary/90 active:shadow-border-sm",
        destructive:
          "bg-gradient-to-b from-destructive/90 to-destructive text-destructive-foreground shadow-border hover:bg-destructive/90 active:shadow-border-sm",
        outline:
          "bg-white text-foreground shadow-border hover:bg-stone-50 active:shadow-border-sm",
        secondary: "bg-stone-200 text-secondary-foreground hover:bg-stone-100",
        ghost: "hover:bg-stone-200 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-3 ",
        sm: "h-6 px-2 text-xs [&_svg]:size-3.5 gap-1",
        lg: "h-10 px-6",
        icon: "h-8 w-8 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  tooltip?: string
  tooltipSide?: "top" | "right" | "bottom" | "left"
  tooltipAlign?: "start" | "center" | "end"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false, 
    loadingText, 
    tooltip,
    tooltipSide = "top",
    tooltipAlign = "center",
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const buttonContent = (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        data-loading={loading}
        {...props}
      >
        {/* <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading-spinner"
              initial={{ opacity: 0, scale: 0.9, width: 0 }}
              animate={{ opacity: 1, scale: 1, width: 16 }}
              exit={{ opacity: 0, scale: 0.9, width: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Loader className="h-3 w-3 loading-spinner animate-spin-slow" />
            </motion.div>
          )}
        </AnimatePresence> */}
        {loading && loadingText ? loadingText : children}
      </Comp>
    )

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
            <TooltipContent side={tooltipSide} align={tooltipAlign}>
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return buttonContent
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
