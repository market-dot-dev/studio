import type { ReactElement } from "react";
import React from "react";

interface CustomerCardProps {
  icon: ReactElement;
  title: string;
  description: string;
  items: {
    icon: ReactElement;
    text: ReactElement | string;
  }[];
}

export default function CustomerCard({
  icon,
  title,
  description,
  items,
}: CustomerCardProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white/[88%] p-6 pb-7 pr-12 pt-5 shadow-sm ring-1 ring-black/[9%] md:rounded-lg md:p-7 md:pb-10 md:pr-9 md:pt-6">
      {React.cloneElement(icon, {
        size: 28,
        className: "h-7 -mx-px text-marketing-swamp",
      })}
      <div className="mb-5 mt-4 md:mb-6">
        <h3 className="text-marketing-primary mb-1 text-[24px] font-bold leading-[28px] tracking-tight">
          {title}
        </h3>
        <p className="text-[15px] leading-5 tracking-[-0.0075em]">
          {description}
        </p>
      </div>
      <ul className="flex flex-col gap-2 text-pretty pl-0.5 text-[15px] leading-5 tracking-[-0.0075em] md:gap-3 lg:max-w-[40ch]">
        {items.map((item) => (
          <li key={item.text.toString()} className="flex gap-4">
            {React.cloneElement(item.icon, {
              size: 20,
              className: "shrink-0 text-marketing-swamp",
            })}
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
