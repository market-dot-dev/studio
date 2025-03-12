import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link";
import { buttonVariants } from "./button";

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded border p-4 pb-4 text-sm [&>svg+div]:translate-y-[-2px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3.5 [&>svg]:text-foreground [&>svg~*]:pl-[30px]",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        warning: "border-none text-white bg-orange-600 [&>svg]:text-white",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("alert-title mb-1 font-semibold leading-none", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("alert-description text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

const AlertButton = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLAttributes<HTMLAnchorElement> & { href: string }
>(({ href, className, ...props }, ref) => (
  <Link
    ref={ref}
    href={href}
    className={cn(buttonVariants({ variant: "outline" }), className)}
    {...props}
  />
));
AlertButton.displayName = "AlertButton";

export { Alert, AlertTitle, AlertDescription, AlertButton };
