"use client";

import TierCard from "@/components/tiers/tier-card";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import SkeletonTiers from "../../skeleton-tiers";
import { TiersEmbedSettingsProps } from "./tiers-embed-settings-props";

const transparentBody = "body {background: transparent}";
// This renders the actual component for both server and client sides.
export default function Tiers({
  tiers,
  subdomain,
  settings,
  hasActiveFeatures,
  className,
  disableButtons
}: {
  tiers: any[];
  subdomain: string;
  settings: TiersEmbedSettingsProps;
  hasActiveFeatures?: boolean;
  className?: string;
  disableButtons?: boolean;
}): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [alteredStyle, setAlteredStyle] = useState<any>({
    transformOrigin: "top left"
  });
  const [containerHeight, setContainerHeight] = useState<number>(0);

  function postHeight(height: number) {
    window.parent.postMessage({ height: height }, "*"); // Adjust as needed for security
  }

  useEffect(() => {
    // Call the function to post height to parent
    const height = document.body.scrollHeight;
    postHeight(height);
  }, []);

  const handleResize = () => {
    if (containerRef.current) {
      const width = containerRef.current.getBoundingClientRect().width;
      const windowWidth = window.innerWidth;
      const scale = windowWidth / width;

      if (scale < 1) {
        setAlteredStyle({
          transform: `scale(${scale})`,
          transformOrigin: "center"
        });
      } else {
        setAlteredStyle({
          transform: "none"
        });
      }

      postHeight(containerRef.current.children[0].getBoundingClientRect().height);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial call
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className={cn("w-full p-1", className)}>
        {alteredStyle.scale !== null ? (
          <div className="mx-auto flex w-full justify-center" style={alteredStyle}>
            {tiers.length ? (
              <div className="flex justify-center gap-6">
                {tiers.map((tier: any, index: number) => (
                  <div key={index} className="min-w-xxs w-full md:max-w-sm lg:max-w-xs">
                    <TierCard
                      openUrlInNewTab={true}
                      tier={tier}
                      darkMode={settings.darkmode}
                      hasActiveFeatures={hasActiveFeatures}
                      alignment={tiers.length === 1 ? "center" : "left"}
                      buttonDisabled={disableButtons}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <SkeletonTiers className="border-none" />
            )}
          </div>
        ) : null}
      </div>

      <style dangerouslySetInnerHTML={{ __html: transparentBody }}></style>
    </>
  );
}
