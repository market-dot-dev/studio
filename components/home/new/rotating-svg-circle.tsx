import React from "react";
import { cn } from "@/lib/utils";

interface RotatingSvgCircleProps {
  size?: number;
  svgCount?: number;
  rotationDuration?: number;
  svgs?: string[];
  className?: string;
}

export default function RotatingSvgCircle({
  size = 400,
  svgCount = 6,
  rotationDuration = 60,
  svgs = [],
  className,
}: RotatingSvgCircleProps = {}) {
  const radius = size / 2;
  const circumference = 2 * Math.PI * radius;
  const dashArray = `${circumference / 50} ${circumference / 50}`;

  const svgSize = size / 10;

  // Default SVG if none provided
  const defaultSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  `;

  return (
    <div
      className={cn("relative animate-spin", className)}
      style={{
        width: size,
        height: size,
        animationDuration: `${rotationDuration}s`,
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
      }}
      role="img"
      aria-label="Rotating circle with SVG elements"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - svgSize / 2}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={dashArray}
        />
      </svg>
      {Array.from({ length: svgCount }).map((_, index) => {
        const angle = (index / svgCount) * 2 * Math.PI;
        const x =
          radius + (radius - svgSize / 2) * Math.cos(angle) - svgSize / 2;
        const y =
          radius + (radius - svgSize / 2) * Math.sin(angle) - svgSize / 2;

        return (
          <div
            key={index}
            className="absolute"
            style={{
              width: svgSize,
              height: svgSize,
              left: x,
              top: y,
            }}
          >
            <div
              className="h-full w-full"
              dangerouslySetInnerHTML={{ __html: svgs[index] || defaultSvg }}
            />
          </div>
        );
      })}
    </div>
  );
}
