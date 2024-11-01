import React, { ReactElement } from "react";

interface SectionProps {
  icon: ReactElement;
  color: string;
  title: string;
  headline: ReactElement | string;
  description: string;
  children: React.ReactNode;
}

export default function Section({ icon, title, headline, description, color, children }: SectionProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="mb-6 flex items-center gap-2 text-[#7d8861] lg:mb-8 lg:text-[24px] lg:leading-8"
        style={{ color }}
      >
        <div style={{ color }}>
          {React.cloneElement(icon, {
            size: 32,
            className: "h-6 w-auto lg:h-8",
          })}
        </div>
        <p>{title}</p>
      </div>
      <h2 className="text-[clamp(32px,8vw,48px)] md:text-[48px] mb-6 max-w-[20ch] text-balance text-center font-bold leading-[0.9] tracking-[-0.035em] lg:text-[64px]">
        {headline}
      </h2>
      <p className="mb-9 max-w-[50ch] text-pretty text-center text-[#8C8C88]">
        {description}
      </p>
      {children}
    </div>
  );
}
