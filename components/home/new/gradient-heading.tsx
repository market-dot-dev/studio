import React from "react";
import { cn } from "@/lib/utils";

interface GradientHeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  children: React.ReactNode;
  className?: string;
}

export default function GradientHeading({
  as: Element = "h1",
  children,
  className,
}: GradientHeadingProps) {
  return (
    <div className="-mb-2">
      <Element
        className={cn(
          "from-marketing-primary/[92%]  to-marketing-primary bg-gradient-to-b bg-clip-text text-transparent",
          "pb-2", // Add 8px padding to the bottom
          className,
        )}
      >
        {children}
      </Element>
    </div>
  );
}
