import type { ReactElement } from "react";
import type { Color } from "@/lib/home/colors";
import React from "react";
import Image from "next/image";
import Link from "@/components/home/link";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";

export interface FeatureCardLinkProps {
  text: string;
  href: string;
  asCard?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

interface FeatureCardProps {
  icon: ReactElement<any>;
  title: string;
  description: ReactElement<any> | string;
  color: Color;
  image?: {
    src: string;
    alt: string;
  };
  orientation?: "horizontal" | "vertical";
  isComingSoon?: boolean;
  imageMaxWidth?: string | null;
  borderRadius?: string;
  link?: FeatureCardLinkProps;
  span?: string;
  className?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  image,
  color,
  orientation = "vertical",
  isComingSoon = false,
  imageMaxWidth = "max-w-[clamp(310px,75%,450px)] sm:max-w-[clamp(350px,85%,520px)] lg:max-w-none",
  borderRadius = 'md:rounded-lg',
  link,
  span = "col-span-1",
  className,
}: FeatureCardProps) {

  const Element = link?.asCard ? "a" : "div";

  return (
    <Element
      href={link?.href}
      onClick={link?.onClick && ((e) => link.onClick?.(e))}
      className={clsx(
        "relative flex h-full w-full overflow-hidden",
        borderRadius,
        link?.asCard &&
          "duration-200 ring-inset ring-black/[18%] transition hover:ring-1",
        className,
        span,
      )}
      style={{
        backgroundImage: `radial-gradient(circle at top right, ${color["10%"]}, #f1f1f0)`,
      }}
    >
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 z-10 overflow-hidden ring-1 ring-inset ring-black/[9%]",
          borderRadius,
        )}
      ></div>
      <div
        className={clsx(
          "flex h-full w-full flex-col items-start justify-between gap-x-6",
          orientation === "horizontal"
            ? "sm:max-h-[500px] md:max-h-[300px] md:flex-row lg:max-h-[320px]"
            : "max-h-[450px]",
        )}
      >
        {isComingSoon && (
          <span
            className="absolute right-0 top-0 h-6 rounded-bl-[6px] border-b border-l border-black/5 pl-[7px] pr-2 text-[10px] font-bold uppercase leading-[23px] tracking-wider text-white shadow-sm md:rounded-tr-lg"
            style={{ backgroundColor: color["100"] }}
          >
            Coming Soon
          </span>
        )}
        <div className="pointer-events-none absolute inset-0 z-[-3] overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div
              className={clsx(
                "pointer-events-none absolute inset-0 -bottom-8 bg-[url('/circuit-pattern.svg?height=100&width=100')] bg-repeat opacity-[6%]",
                image ? "right-[25%] -ml-px" : "left-[28.75%] -mt-0.5",
              )}
              style={{
                maskImage: image
                  ? "radial-gradient(ellipse 220% 140% at bottom left, black, transparent 50%)"
                  : "radial-gradient(ellipse 220% 140% at top right, black, transparent 50%)",
                WebkitMaskImage: image
                  ? '"radial-gradient(ellipse 220% 140% at bottom left, black, transparent 50%)",'
                  : "radial-gradient(ellipse 220% 140% at top right, black, transparent 50%)",
              }}
            />
          </div>
        </div>
        <div
          className={clsx(
            "z-10 flex flex-col gap-x-4 gap-y-3 p-6",
            image && "sm:gap-y-4 sm:pt-5 lg:gap-3",
            orientation === "horizontal" ? "max-w-[25ch]" : "w-full",
          )}
        >
          <div
            className={clsx(
              "flex h-6 items-center justify-between",
              image && "sm:h-7 lg:h-6",
            )}
          >
            {React.cloneElement(icon, {
              size: 28,
              color: color["100"],
              className: `h-6 w-auto ${image ? "sm:h-7 lg:h-6" : ""}`,
            })}
            {link && !link.asCard && (
              <Link
                href={link.href}
                className="tracking-[-0.015em] sm:leading-7 text-marketing-sm group -mr-1 flex items-center gap-[3px] leading-6 brightness-[95%] hover:brightness-[85%] lg:leading-6"
                style={{ color: color["100"] }}
              >
                {link.text}
                <ChevronRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition group-hover:translate-x-px group-active:translate-x-0"
                />
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3
              className={clsx(
                "text-marketing-primary text-marketing-base text-pretty font-bold tracking-tight  ",
                image && "sm:text-2xl sm:leading-7 lg:text-[19px] lg:leading-6",
              )}
            >
              {title}
            </h3>
            <p
              className={clsx(
                "text-marketing-sm max-w-[40ch] text-balance leading-5 tracking-[-0.0075em] text-black/40",
                image &&
                  "sm:max-w-[45ch] sm:text-pretty lg:max-w-[41ch] lg:text-balance",
              )}
            >
              {description}
            </p>
          </div>
        </div>
        {image && (
          <div
            className={clsx(
              "xs:pl-12 z-[-2] ml-auto justify-self-end overflow-visible pl-6 drop-shadow-[-1px_-1px_0_rgba(0,0,0,0.09)] sm:pl-24",
              orientation === "horizontal" ? "md:pt-3" : "w-full sm:pt-3",
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
    </Element>
  );
}
