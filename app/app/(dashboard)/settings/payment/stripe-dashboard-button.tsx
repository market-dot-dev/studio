import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface StripeDashboardButtonProps extends Omit<ButtonProps, "asChild"> {
  children?: React.ReactNode;
  className?: string;
}

export function StripeDashboardButton({
  variant = "outline",
  children,
  className,
  ...props
}: StripeDashboardButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      className={cn("w-full rounded-t-none shadow-none", className)}
      {...props}
    >
      <Link
        href={process.env.STRIPE_DASHBOARD_URL!}
        target="_blank"
        className="flex items-center gap-2"
      >
        {children}
      </Link>
    </Button>
  );
}
