import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface ViewButtonProps {
    href: string;
    children?: React.ReactNode;
    className?: string;
}

const ViewButton = React.forwardRef<HTMLAnchorElement, ViewButtonProps>(
    ({ href, children = "View", className, ...props }, ref) => (
        <Button variant="outline" size="sm" asChild className={className}>
            <Link ref={ref} href={href} {...props}>
                {children}
                <ChevronRight size={14} />
            </Link>
        </Button>
    )
);
ViewButton.displayName = "ViewButton";

export { ViewButton };
