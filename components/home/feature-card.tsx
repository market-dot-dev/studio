import Link from "@/components/home/link";
import type { Color } from "@/lib/home/colors";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import type { ReactElement } from "react";
import React from "react";

export interface FeatureCardLinkProps {
  text: string;
  href: string;
  asCard?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

interface FeatureCardProps {
  icon: ReactElement<any>;
  title: ReactElement<any> | string;
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
  size?: "default" | "small";
}

export default function FeatureCard({
  icon,
  title,
  description,
  image,
  color,
  orientation = "vertical",
  isComingSoon = false,
  imageMaxWidth = "max-w-[450px] sm:max-w-[clamp(350px,75%,450px)] lg:max-w-none",
  borderRadius = "md:rounded-lg",
  link,
  span = "col-span-1",
  className,
  size = "default"
}: FeatureCardProps) {
  const Element = link?.asCard ? "a" : "div";

  return (
    <Element
      href={link?.href}
      onClick={link?.onClick && ((e) => link.onClick?.(e))}
      className={clsx(
        "relative flex size-full overflow-hidden",
        borderRadius,
        link?.asCard && "ring-inset ring-black/25 transition duration-200 hover:ring-1",
        className,
        span
      )}
      style={{
        backgroundImage: `radial-gradient(circle at top right, ${color["10%"]}, #f1f1f0)`
      }}
    >
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 z-10 overflow-hidden ring-1 ring-inset ring-black/[9%]",
          borderRadius
        )}
      ></div>
      <div
        className={clsx(
          "flex size-full min-h-0 flex-col items-start justify-between gap-x-6",
          orientation === "horizontal"
            ? "sm:max-h-[500px] md:max-h-[300px] md:flex-row lg:max-h-[320px]"
            : "max-h-[450px]"
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
                "pointer-events-none absolute inset-0 -bottom-8 bg-repeat opacity-[6%]",
                image ? "right-1/4 -ml-px" : "left-[28.75%] -mt-0.5"
              )}
              style={{
                maskImage: image
                  ? "radial-gradient(ellipse 220% 140% at bottom left, black, transparent 50%)"
                  : "radial-gradient(ellipse 220% 140% at top right, black, transparent 50%)",
                WebkitMaskImage: image
                  ? '"radial-gradient(ellipse 220% 140% at bottom left, black, transparent 50%)",'
                  : "radial-gradient(ellipse 220% 140% at top right, black, transparent 50%)"
              }}
            />
          </div>
        </div>
        <div
          className={clsx(
            "z-10 flex flex-col gap-x-4",
            orientation === "horizontal" ? "max-w-[25ch]" : "w-full",
            size === "small" ? "gap-y-2 p-5" : "gap-y-3 p-6"
          )}
        >
          <div className={clsx("flex h-6 items-center justify-between")}>
            {React.cloneElement(icon, {
              size: size === "small" ? 24 : 28,
              color: color["100"],
              className: clsx("w-auto", size === "small" ? "h-5" : "h-6")
            })}
            {link && !link.asCard && (
              <Link
                href={link.href}
                className={clsx(
                  "group -mr-1 flex items-center gap-[3px] tracking-[-0.015em] brightness-[95%] hover:brightness-[85%] sm:leading-7 lg:leading-6",
                  size === "small"
                    ? "text-marketing-xs sm:leading-6 lg:leading-5"
                    : "text-marketing-sm/5"
                )}
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
          <div className={clsx("flex flex-col", size === "small" ? "gap-1" : "gap-2")}>
            <h3
              className={clsx(
                "text-pretty text-marketing-base font-bold tracking-tight text-marketing-primary",
                image && "sm:text-xl xl:text-[19px] xl:leading-6",
                size === "small" && "text-marketing-sm"
              )}
            >
              {title}
            </h3>
            <p
              className={clsx(
                "max-w-[40ch] text-balance tracking-[-0.0075em] text-black/40",
                image && "sm:max-w-[45ch] sm:text-pretty lg:max-w-[41ch] lg:text-balance",
                size === "small" ? "text-marketing-xs/4" : "text-marketing-sm/5"
              )}
            >
              {description}
            </p>
          </div>
        </div>
        {image && (
          <div
            className={clsx(
              "z-[-2] ml-auto max-w-screen-lg justify-self-end overflow-visible pl-12 drop-shadow-[-1px_-1px_0_rgba(0,0,0,0.09)] xs:pl-12 sm:pl-24",
              orientation === "horizontal" ? "md:pt-3" : "w-full sm:pt-3",
              imageMaxWidth
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              height={800}
              width={600}
              className={`size-full min-h-0 justify-self-end drop-shadow-sm ${
                orientation === "horizontal" ? "object-contain" : "object-cover"
              }`}
            />
          </div>
        )}
      </div>
    </Element>
  );
}
