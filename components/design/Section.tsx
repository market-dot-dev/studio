"use client";

import clsx from "clsx";
import React, { ReactElement } from "react";

interface SectionProps {
  headline: ReactElement | string;
  description: string;
  children: React.ReactNode;
  color?: string;
  badge?: {
    icon: ReactElement;
    title: string;
  };
  isFullBleed?: boolean;
  className?: string;
}

export default function Section({
  badge,
  headline,
  description,
  color,
  isFullBleed = false,
  className,
  children,
}: SectionProps) {
  return (
    <div
      className={clsx(
        "relative flex flex-col items-center",
        !badge && "md:mt-[56px]",
        className,
      )}
    >
      {badge && (
        <div
          className="mb-6 flex items-center gap-2 text-[24px] leading-8 text-[#7d8861] lg:mb-8"
          style={{ color }}
        >
          <div style={{ color }}>
            {React.cloneElement(badge.icon, {
              size: 32,
              className: "h-7 w-auto",
            })}
          </div>
          <p>{badge.title}</p>
        </div>
      )}
      <h2 className="text-marketing-primary mb-4 max-w-[20ch] text-balance text-center text-[clamp(32px,11vw,48px)] font-bold leading-[1] tracking-[-0.035em] sm:leading-[0.9] md:text-[48px] lg:mb-6 lg:text-[64px]">
        {headline}
      </h2>
      <p className="mb-9 max-w-[50ch] text-pretty text-center">{description}</p>
      <div
        className={clsx(
          "relative",
          isFullBleed ? " -mx-6 w-screen md:m-0 md:w-full" : "w-full",
        )}
      >
        {children}
      </div>
    </div>
  );
}
// "use client";

// import clsx from "clsx";
// import React, { ReactElement } from "react";

// interface SectionProps {
//   headline: ReactElement | string;
//   description: string;
//   children: React.ReactNode;
//   color?: string;
//   badge?: {
//     icon: ReactElement;
//     title: string;
//   };
//   isFullBleed?: boolean;
//   className?: string;
//   showDashedLine?: boolean;
// }

// export default function Section({
//   badge,
//   headline,
//   description,
//   color,
//   isFullBleed = false,
//   className,
//   children,
//   showDashedLine = false,
// }: SectionProps) {
//   return (
//     <div
//       className={clsx(
//         "relative flex flex-col items-center",
//         !badge && "md:mt-[56px]",
//         className,
//       )}
//     >
//       {badge && (
//         <div
//           className="mb-6 flex items-center gap-2 text-[24px] leading-8 text-[#7d8861] lg:mb-8"
//           style={{ color }}
//         >
//           <div style={{ color }}>
//             {React.cloneElement(badge.icon, {
//               size: 32,
//               className: "h-6 w-auto lg:h-8",
//             })}
//           </div>
//           <p>{badge.title}</p>
//         </div>
//       )}
//       <h2 className="text-marketing-primary mb-4 max-w-[20ch] text-balance text-center text-[clamp(32px,16vw,48px)] font-bold leading-[1] tracking-[-0.035em] sm:leading-[0.9] md:text-[48px] lg:mb-6 lg:text-[64px]">
//         {headline}
//       </h2>
//       <p className="mb-9 max-w-[50ch] text-pretty text-center">{description}</p>
//       <div
//         className={clsx(
//           "relative",
//           isFullBleed ? " -mx-6 w-screen md:m-0 md:w-full" : "w-full",
//           showDashedLine && "section-dashed-line",
//         )}
//         style={
//           {
//             "--stroke-color": color,
//           } as React.CSSProperties
//         }
//       >
//         {children}
//       </div>
//       <style jsx>{`
//         .section-dashed-line::before {
//           content: "";
//           position: absolute;
//           left: 34px;
//           top: 64px;
//           bottom: 64px;
//           width: 2px;
//           height: auto;
//           opacity: 0.8;
//           background-image: linear-gradient(
//             to bottom,
//             var(--stroke-color) 50%,
//             transparent 50%
//           );
//           background-size: 2px 12px;
//           background-repeat: repeat-y;
//           animation: dashedLineAnimation 20s linear infinite;
//           z-index: -1;
//         }

//         @keyframes dashedLineAnimation {
//           to {
//             background-position: 0 240px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
