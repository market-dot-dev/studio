"use client";

import { useEffect, useRef, useState } from "react";

export function PreviewFrame({ children }: { children: React.ReactNode }) {
  const wrappingDiv = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!wrappingDiv.current) return;

    const updateScale = () => {
      if (wrappingDiv.current) {
        const frame = wrappingDiv.current;
        const width = frame.clientWidth;
        setScale(width / 1600);
      }
    };

    // Initialize ResizeObserver
    observerRef.current = new ResizeObserver((entries) => {
      // We only have one element being observed
      if (entries.length > 0) {
        updateScale();
      }
    });

    // Start observing the wrapping div
    observerRef.current.observe(wrappingDiv.current);

    // Initial scale update
    updateScale();

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Also update scale when children change (content updates)
  useEffect(() => {
    if (wrappingDiv.current) {
      const width = wrappingDiv.current.clientWidth;
      setScale(width / 1600);
    }
  }, [children]);

  return (
    <div className="w-full overflow-x-hidden" ref={wrappingDiv}>
      <div
        className="w-[1600px]"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}
