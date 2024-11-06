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
    <div className="-m-3"> {/* Offset extra space */}
      <Element
        className={cn(
          "bg-gradient-to-b from-marketing-primary/[91%] to-marketing-primary bg-clip-text text-transparent",
          "p-3", // Extra space so the mask doesn't clip text with a tighter line height
          className,
        )}
      >
        {children}
      </Element>
    </div>
  );
}
