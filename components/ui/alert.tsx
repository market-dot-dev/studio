import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";
import { buttonVariants } from "./button";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded bg-background p-4 text-sm text-foreground shadow-border-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3.5 [&>svg]:size-4 [&>svg]:translate-y-px [&>svg]:stroke-[2] [&>svg~*]:pl-[30px]",
  {
    variants: {
      variant: {
        default: "[&>svg]:text-muted-foreground",
        success: "[&>svg]:text-success",
        warning: "[&>svg]:text-warning",
        destructive: "[&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h5
      ref={ref}
      className={cn("alert-title mb-1.5 font-semibold leading-none", className)}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "alert-description text-sm text-muted-foreground [&_p]:leading-relaxed -translate-y-[2px] -mb-0.5",
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

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

export { Alert, AlertButton, AlertDescription, AlertTitle };
