import React, { ReactElement } from "react";

interface SectionProps {
  badge?: {
    icon: ReactElement;
    title: string;
  }
  color: string;
  headline: ReactElement | string;
  description: string;
  children: React.ReactNode;
}

export default function Section({ badge, headline, description, color, children }: SectionProps) {
  return (
    <div className="flex flex-col items-center">
      {badge && (
        <div
          className="mb-6 flex items-center gap-2 text-[#7d8861] lg:mb-8 text-[24px] leading-8"
          style={{ color }}
        >
          <div style={{ color }}>
            {React.cloneElement(badge.icon, {
              size: 32,
              className: "h-6 w-auto lg:h-8",
            })}
          </div>
          <p>{badge.title}</p>
        </div>
      )}
      <h2 className="mb-4 md:mb-6 max-w-[20ch] text-balance text-center text-[clamp(32px,9.5vw,48px)] font-bold leading-[1] md:leading-[0.9] tracking-[-0.035em] md:text-[48px] lg:text-[64px]">
        {headline}
      </h2>
      <p className="mb-9 max-w-[50ch] text-pretty text-center text-[#8C8C88]">
        {description}
      </p>
      {children}
    </div>
  );
}
