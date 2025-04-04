import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  textColor?: string;
  shimmerColor?: string;
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

/**
 * ShimmerText component creates text with a shimmer effect moving across it
 */
export function ShimmerText({
  text,
  textColor = "#79716b",
  shimmerColor = "#000",
  speed = "normal",
  className,
  ...props
}: ShimmerTextProps) {
  // Calculate animation speed
  const getAnimationDuration = () => {
    switch (speed) {
      case "slow":
        return "3s";
      case "fast":
        return "1.5s";
      default:
        return "2s";
    }
  };

  // Create custom styles for the shimmer effect
  const shimmerStyles = {
    "--base-color": textColor,
    "--shimmer-color": shimmerColor,
    "--animation-duration": getAnimationDuration(),
  } as React.CSSProperties;

  return (
    <span
      className={cn(
        "shimmer-text inline-block bg-clip-text text-transparent",
        className,
      )}
      style={shimmerStyles}
      {...props}
    >
      {text}
    </span>
  );
} 