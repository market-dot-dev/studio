"use client";

import React, { ReactElement } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

interface FeatureCardProps {
  icon: ReactElement;
  title: string;
  description: string;
  color: {
    "100": string;
    "10": string;
  };
  image?: {
    src: string;
    alt: string;
  };
  orientation?: "horizontal" | "vertical";
  isComingSoon?: boolean;
  imageMaxWidth?: string | null;
  link?: {
    text: string;
    href: string;
  }
  span?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  image,
  color,
  orientation = "vertical",
  isComingSoon = false,
  imageMaxWidth = "sm:max-w-[70%] lg:max-w-[400px]",
  link,
  span = 'col-span-1'
}: FeatureCardProps) {
  return (
    <div
      className={clsx(
        'relative flex h-full w-full flex-col items-start justify-between gap-x-6 overflow-hidden rounded-lg ring-1 ring-inset ring-black/[10%]',
        orientation === "horizontal"
          ? "sm:max-h-[500px] md:max-h-[300px] md:flex-row lg:max-h-[320px]"
          : "max-h-[450px]",
        span,
      )}
      style={{
        backgroundImage: `radial-gradient(circle at top right, ${color["10"]}, #f1f1f0)`,
      }}
    >
      {isComingSoon && (
        <span
          className="absolute right-0 top-0 rounded-bl-md rounded-tr-lg border-b border-l border-black/5 px-2 text-[10px] font-bold uppercase leading-6 tracking-wider text-white"
          style={{ backgroundColor: color["100"] }}
        >
          Coming Soon
        </span>
      )}
      <div className="pointer-events-none absolute inset-0 z-[-2]">
        <div className="pointer-events-none absolute inset-0">
          <div
            className={clsx(
              "absolute inset-0 -bottom-8 bg-[url('/circuit-pattern.svg?height=50&width=50')] bg-repeat opacity-[7%]",
              image ? "right-[25%] -ml-px" : "left-[26.5%] -mt-0.5 -mr-1",
            )}
            style={{
              maskImage: image
                ? "radial-gradient(ellipse 220% 140% at bottom left, black, transparent 45%)"
                : "radial-gradient(ellipse 220% 140% at top right, black, transparent 45%)",
              WebkitMaskImage: image
                ? '"radial-gradient(ellipse 220% 140% at bottom left, black, transparent 45%)",'
                : "radial-gradient(ellipse 220% 140% at top right, black, transparent 45%)",
            }}
          />
        </div>
      </div>
      <div
        className={`z-10 flex flex-col gap-3 p-6 pt-5 ${
          orientation === "horizontal" ? "max-w-[25ch]" : "w-full"
        }`}
      >
        <div
          className="flex h-6 items-center justify-between"
          style={{ color: color["100"] }}
        >
          {React.cloneElement(icon, { size: 24 })}
          {link && (
            <Link
              href={link.href}
              className="group -mr-1 flex items-center gap-[3px] text-[15px] leading-6 hover:brightness-90"
              style={{ color: color["100"] }}
            >
              {link.text}
              <ChevronRight
                size={16}
                strokeWidth={2.5}
                className="transition group-hover:translate-x-px"
              />
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold tracking-tight text-gray-900">
            {title}
          </h3>
          <p className="max-w-[40ch] text-balance text-[15px] leading-5 tracking-[-0.0075em] text-black/40">
            {description}
          </p>
        </div>
      </div>
      {image && (
        <div
          className={clsx(
            "z-[-1] ml-auto justify-self-end overflow-visible pl-12 drop-shadow-[-1px_-1px_0_rgba(0,0,0,0.09)] xl:pl-24",
            orientation === "horizontal" ? "pt-3" : "w-full pt-3 lg:pt-6",
            imageMaxWidth,
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            height={800}
            width={600}
            className={`h-full w-full justify-self-end drop-shadow-sm ${
              orientation === "horizontal" ? "object-contain" : "object-cover"
            }`}
          />
        </div>
      )}
    </div>
  );
}
