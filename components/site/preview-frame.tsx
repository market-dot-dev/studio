"use client";

import { type ReactNode } from "react";

const PREVIEW_SCALE = 0.7;

export function PreviewFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full overflow-hidden relative">
      <div 
        className="w-full h-full bg-white relative overflow-x-hidden"
        style={{ 
          // Transform creates a new containing block for fixed positioned elements
          // This makes position:fixed elements behave like position:absolute within this container
          transform: "translate3d(0, 0, 0)",
          contain: "layout paint",
          willChange: "transform"
        }}
      >
        <div 
          className="relative min-h-full isolate "
          style={{ 
            // Apply scale to see more content while maintaining responsive behavior
            width: `${100 / PREVIEW_SCALE}%`,
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: "top left"
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
