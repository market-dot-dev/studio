import React, { ReactElement } from "react";

interface SectionProps {
  icon: ReactElement;
  color: string;
  title: string;
  headline: string;
  description: string;
  children: React.ReactNode;
}

export default function Section({ icon, title, headline, description, color, children }: SectionProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="mb-6 lg:mb-9 flex items-center gap-2 text-[#7d8861] lg:text-[24px] lg:leading-8"
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
      <h2 className="mb-6 text-balance text-center text-[48px] font-bold leading-[0.9] tracking-[-0.035em] lg:text-[64px] max-w-[20ch]">
        {headline}
      </h2>
      <p className="mb-9 max-w-[50ch] text-pretty text-center text-[#8C8C88]">
        {description}
      </p>
      {children}
    </div>
  );
}
