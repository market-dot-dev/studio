"use client";

import React, { ReactElement } from "react";
import Image from "next/image";
import clsx from "clsx";

interface FeatureCardProps {
  icon: ReactElement;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  color: string;
  orientation?: "horizontal" | "vertical";
  isComingSoon?: boolean;
  imageMaxWidth?: string | null;
}

export default function FeatureCard({
  icon,
  title,
  description,
  image,
  color,
  orientation = "vertical",
  isComingSoon = false,
  imageMaxWidth = "max-w-[400px] lg:max-w-[400px]",
}: FeatureCardProps) {
  return (
    <div
      className={`bg-[#f2f2f2] relative flex h-full w-full flex-col items-start justify-between gap-x-6 overflow-hidden rounded-lg ring-1 ring-inset ring-black/[9%] ${
        orientation === "horizontal"
          ? "sm:max-h-[500px] md:max-h-[300px] md:flex-row lg:max-h-[275px] 2xl:max-h-[300px]"
          : "max-h-[400px]"
      }`}
    >
      {isComingSoon && (
        <span
          className="absolute right-0 top-0 rounded-bl-md rounded-tr-lg border-b border-l border-black/10 px-2 text-[10px] font-bold uppercase leading-6 tracking-wider text-white"
          style={{ backgroundColor: color }}
        >
          Coming Soon
        </span>
      )}
      <div className="pointer-events-none absolute inset-0 z-[-2]">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 -bottom-8 right-[25%] -ml-px bg-[url('/circuit-pattern.svg?height=50&width=50')] bg-repeat opacity-[8%]"
            style={{
              maskImage:
                "radial-gradient(ellipse 220% 140% at bottom left, black, transparent 45%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 220% 140% at bottom left, black, transparent 45%)",
            }}
          />
          {/* <div
            className="absolute inset-0 -bottom-6 bg-gradient-to-tr to-transparent"
            style={{
              maskImage:
                "radial-gradient(ellipse 340% 120% at bottom left, black, black 60%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 340% 120% at bottom left, black, black 60%, transparent 80%)",
              mixBlendMode: "overlay",
              from: `${color}/[20%]`,
              via: `${color}/[3%]`,
            }}
          /> */}
        </div>
      </div>
      <div
        className={`z-10 flex flex-col gap-3 p-6 pt-5 ${
          orientation === "horizontal" ? "max-w-[25ch]" : "w-full"
        }`}
      >
        <div style={{ color }}>{React.cloneElement(icon, { size: 24 })}</div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold tracking-tight text-gray-900">
            {title}
          </h3>
          <p className="max-w-[40ch] text-balance text-[15px] leading-5 tracking-normal text-black/40">
            {description}
          </p>
        </div>
      </div>
      <div
        className={clsx(
          "z-[-1] ml-auto justify-self-end overflow-visible pl-12 drop-shadow-[-1px_-1px_0_rgba(0,0,0,0.08)] xl:pl-24",
          orientation === "horizontal" ? "pt-3" : "w-full pt-3 lg:pt-6",
          imageMaxWidth,
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          height={800}
          width={600}
          className={`h-full w-full justify-self-end ${
            orientation === "horizontal" ? "object-contain" : "object-cover"
          }`}
        />
      </div>
    </div>
  );
}
