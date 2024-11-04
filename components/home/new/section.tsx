"use client";

import clsx from "clsx";
import React, { ReactElement } from "react";
import GradientHeading from "./gradient-heading";

interface SectionProps {
  children: React.ReactNode;
  headline?: ReactElement | string;
  description?: ReactElement | string;
  id?: string;
  color?: string;
  badge?: {
    icon: ReactElement;
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
        "relative mx-auto flex max-w-[800px] flex-col items-center px-6 lg:max-w-[1300px] lg:px-12 w-full scroll-mt-24",
        className,
      )}
      {...attributes}
    >
      {badge && (
        <div
          className="sm:text-marketing-md mb-4 flex items-center gap-2 sm:mb-6"
          style={{ color }}
        >
          <div style={{ color }}>
            {React.cloneElement(badge.icon, {
              size: 32,
              className: "h-6 sm:h-7 w-auto",
            })}
          </div>
          <p>{badge.title}</p>
        </div>
      )}
      {headline && (
        <GradientHeading
          as="h2"
          className="sm:text-marketing-2xl lg:text-marketing-3xl mb-3 max-w-[17ch] text-balance text-center text-[clamp(30px,11vw,37px)] font-bold leading-[1] tracking-[-0.035em] sm:mb-4"
        >
          {headline}
        </GradientHeading>
      )}
      {description && (
        <p className="text-marketing-sm sm:text-marketing-base mb-5 max-w-[45ch] text-pretty text-center sm:mb-8">
          {description}
        </p>
      )}
      <div
        className={clsx(
          "relative",
          isFullBleed ? "-mx-6 w-screen md:m-0 md:w-full" : "w-full",
        )}
      >
        {children}
      </div>
    </div>
  );
}