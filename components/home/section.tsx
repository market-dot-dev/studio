"use client";

import clsx from "clsx";
import React, { ReactElement } from "react";
import GradientHeading from "./gradient-heading";

interface SectionProps {
  children: React.ReactNode;
  headline?: ReactElement<any> | string;
  description?: ReactElement<any> | string;
  id?: string;
  color?: string;
  badge?: {
    icon: ReactElement<any>;
    title: string;
  };
  isFullBleed?: boolean;
  className?: string;
}

export default function FeatureSection({
  badge,
  headline,
  description,
  color,
  isFullBleed = false,
  className,
  children,
  ...attributes
}: SectionProps) {
  return (
    <div
      className={clsx(
        "relative mx-auto flex w-full max-w-[800px] scroll-mt-28 flex-col items-center px-6 lg:max-w-[var(--marketing-max-width)] lg:px-16",
        className
      )}
      {...attributes}
    >
      {badge && (
        <div
          className="mb-4 flex items-center gap-2 sm:mb-6 sm:text-marketing-md"
          style={{ color }}
        >
          <div style={{ color }}>
            {React.cloneElement(badge.icon, {
              size: 32,
              className: "h-6 sm:h-7 w-auto"
            })}
          </div>
          <p>{badge.title}</p>
        </div>
      )}
      {headline && (
        <GradientHeading
          as="h2"
          className="mb-3 max-w-[25ch] text-balance text-center text-[clamp(30px,11vw,37px)] font-bold leading-none tracking-[-0.035em] sm:mb-4 sm:text-marketing-2xl lg:text-marketing-3xl"
        >
          {headline}
        </GradientHeading>
      )}
      {description && (
        <p className="mb-6 max-w-[45ch] text-pretty text-center text-marketing-sm/5 sm:mb-8 sm:text-marketing-base">
          {description}
        </p>
      )}
      <div className={clsx("relative", isFullBleed ? "-mx-6 w-screen md:m-0 md:w-full" : "w-full")}>
        {children}
      </div>
    </div>
  );
}
