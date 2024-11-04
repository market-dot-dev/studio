"use client";

import clsx from "clsx";
import React from "react";

interface AnimatedDashedLineProps {
  width?: number;
  height?: number;
  strokeWidth?: number;
  strokeColor?: string;
  dashArray?: string;
  animationDuration?: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export default function AnimatedDashedLine({
  width = 300,
  height = 300,
  strokeWidth = 4,
  strokeColor = "#8C8C88",
  dashArray = "6,6",
  animationDuration = 2.5,
  orientation = "horizontal",
  className,
}: AnimatedDashedLineProps = {}) {
  const isHorizontal = orientation === "horizontal";
  const lineLength = isHorizontal ? width : height;

  return (
    <div
      className={clsx("overflow-hidden", className)}
      role="img"
      aria-label={`Animated dashed line (${orientation})`}
    >
      <svg width={width} height={height}>
        <line
          x1={isHorizontal ? 0 : width / 2}
          y1={isHorizontal ? height / 2 : 0}
          x2={isHorizontal ? width : width / 2}
          y2={isHorizontal ? height / 2 : height}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          className="animate-dash"
        />
      </svg>
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -${parseInt(dashArray.split(",")[0]) * 2};
          }
        }
        .animate-dash {
          animation: dash ${animationDuration}s linear infinite;
        }
      `}</style>
    </div>
  );
}
