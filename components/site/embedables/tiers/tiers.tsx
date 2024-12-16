"use client";
import { Button } from "@tremor/react";
import { useEffect, useRef, useState } from "react";
import { TiersEmbedSettingsProps } from "./tiers-embed-settings";
import SkeletonTiers from "../../skeleton-tiers";
import TierCard from "@/components/tiers/tier-card";
import Link from "next/link";
import { cn } from "@/lib/utils";

const transparentBody = "body {background: transparent}";
// This renders the actual component for both server and client sides.
export default function Tiers({
  tiers,
  subdomain,
  settings,
  hasActiveFeatures,
  className,
}: {
  tiers: any[];
  subdomain: string;
  settings: TiersEmbedSettingsProps;
  hasActiveFeatures?: boolean;
  className?: string;
}): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [alteredStyle, setAlteredStyle] = useState<any>({
    transformOrigin: "top left",
  });

  useEffect(() => {
    function postHeight() {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ height: height }, "*"); // Adjust as needed for security
    }

    // Call the function to post height to parent
    postHeight();
  }, []);

  // const handleResize = () => {
  //   if (containerRef.current) {
  //     // get width of container
  //     const width = containerRef.current.getBoundingClientRect().width;

  //     // window width
  //     const windowWidth = window.innerWidth;
  //     const scale = width / windowWidth;

  //     // set the scale
  //     if (scale < 1) {
  //       setAlteredStyle({
  //         transform: `scale(${scale})`,
  //         transformOrigin: "top left",
  //       });
  //     } else {
  //       setAlteredStyle({
  //         transform: "none",
  //       });
  //     }

  //     setContainerHeight(
  //       containerRef.current.children[0].getBoundingClientRect().height,
  //     );
  //   }
  // };

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial call
    // handleResize();

    // // Add resize event listener
    // window.addEventListener("resize", handleResize);

    // // Cleanup event listener on component unmount
    // return () => {
    //   window.removeEventListener("resize", handleResize);
    // };
  }, []);

  return (
    <>
      <div ref={containerRef} className={cn("w-full", className)}>
        {alteredStyle.scale !== null ? (
          <div
            className="mx-auto flex w-full justify-center lg:py-6"
            style={alteredStyle}
          >
            {tiers.length ? (
              <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap justify-center gap-6 rounded-[38px] border border-dashed border-gray-300 bg-[#FDFDFD] p-8">
                {tiers.map((tier: any, index: number) => (
                  <div
                    key={index}
                    className="min-w-xxs w-full md:max-w-sm lg:max-w-xs"
                  >
                    <TierCard
                      tier={tier}
                      url={subdomain}
                      darkMode={settings.darkmode}
                      hasActiveFeatures={hasActiveFeatures}
                      alignment={tiers.length === 1 ? "center" : "left"}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <SkeletonTiers />
            )}
          </div>
        ) : null}
      </div>

      <style dangerouslySetInnerHTML={{ __html: transparentBody }}></style>
    </>
  );
}
