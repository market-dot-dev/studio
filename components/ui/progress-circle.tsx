import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const backgroundVariants = cva("transition-colors ease-linear", {
  variants: {
    variant: {
      default: "stroke-primary-200 dark:stroke-primary-500/30",
      neutral: "stroke-slate-200 dark:stroke-slate-500/40",
      warning: "stroke-yellow-200 dark:stroke-yellow-500/30",
      error: "stroke-red-200 dark:stroke-red-500/30",
      success: "stroke-emerald-200 dark:stroke-emerald-500/30"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

const circleVariants = cva("transition-colors ease-linear", {
  variants: {
    variant: {
      default: "stroke-primary-500 dark:stroke-primary-500",
      neutral: "stroke-slate-500 dark:stroke-slate-500",
      warning: "stroke-yellow-500 dark:stroke-yellow-500",
      error: "stroke-red-500 dark:stroke-red-500",
      success: "stroke-emerald-500 dark:stroke-emerald-500"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

type ProgressCircleVariants = VariantProps<typeof backgroundVariants>;

export type ColorType = "primary" | "gray" | "yellow" | "red" | "green";
export type SizeType = "sm" | "md" | "lg";

export interface ProgressCircleProps
  extends Omit<React.SVGProps<SVGSVGElement>, "value">,
    ProgressCircleVariants {
  value?: number;
  max?: number;
  showAnimation?: boolean;
  radius?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  color?: ColorType;
  size?: SizeType;
}

const ProgressCircle = React.forwardRef<SVGSVGElement, ProgressCircleProps>(
  (
    {
      value = 0,
      max = 100,
      radius = 32,
      strokeWidth = 6,
      showAnimation = true,
      variant = "default",
      className,
      children,
      color,
      size,
      ...props
    },
    ref
  ) => {
    let effectiveVariant = variant;
    if (color) {
      switch (color) {
        case "primary":
          effectiveVariant = "default";
          break;
        case "gray":
          effectiveVariant = "neutral";
          break;
        case "yellow":
          effectiveVariant = "warning";
          break;
        case "red":
          effectiveVariant = "error";
          break;
        case "green":
          effectiveVariant = "success";
          break;
      }
    }

    // Handle size from original code
    let effectiveRadius = radius;
    let effectiveStrokeWidth = strokeWidth;
    if (size) {
      switch (size) {
        case "sm":
          effectiveRadius = 20;
          effectiveStrokeWidth = 4;
          break;
        case "md":
          effectiveRadius = 32;
          effectiveStrokeWidth = 6;
          break;
        case "lg":
          effectiveRadius = 48;
          effectiveStrokeWidth = 8;
          break;
      }
    }

    const safeValue = Math.min(max, Math.max(value, 0));
    const normalizedRadius = effectiveRadius - effectiveStrokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const offset = circumference - (safeValue / max) * circumference;

    return (
      <div
        className={cn("relative")}
        role="progressbar"
        aria-label="Progress circle"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        data-max={max}
        data-value={safeValue ?? null}
      >
        <svg
          ref={ref}
          width={effectiveRadius * 2}
          height={effectiveRadius * 2}
          viewBox={`0 0 ${effectiveRadius * 2} ${effectiveRadius * 2}`}
          className={cn("-rotate-90 transform", className)}
          {...props}
        >
          <circle
            r={normalizedRadius}
            cx={effectiveRadius}
            cy={effectiveRadius}
            strokeWidth={effectiveStrokeWidth}
            fill="transparent"
            strokeLinecap="round"
            className={cn(backgroundVariants({ variant: effectiveVariant }))}
          />
          {safeValue >= 0 ? (
            <circle
              r={normalizedRadius}
              cx={effectiveRadius}
              cy={effectiveRadius}
              strokeWidth={effectiveStrokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
              fill="transparent"
              strokeLinecap="round"
              className={cn(
                circleVariants({ variant: effectiveVariant }),
                showAnimation && "transform-gpu transition-all duration-300 ease-in-out"
              )}
            />
          ) : null}
        </svg>
        <div className={cn("absolute inset-0 flex items-center justify-center")}>{children}</div>
      </div>
    );
  }
);

ProgressCircle.displayName = "ProgressCircle";

export { ProgressCircle };
