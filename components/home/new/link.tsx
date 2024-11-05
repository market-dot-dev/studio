import type { LinkProps } from "next/link";
import React from "react";
import * as NextLink from "next/link";
import clsx from "clsx";

export type CustomLinkProps = {
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  style?: React.CSSProperties;
  className?: string;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
} & LinkProps;

export default function Link({
  className,
  children,
  variant = 'secondary',
  ...props
}: CustomLinkProps) {
  return (
    <NextLink.default
      {...props}
      className={clsx(
        "duration-[175ms] transition-colors",
        variant === "primary"
          ? "text-marketing-primary"
          : "text-marketing-secondary hover:text-marketing-primary",
        className,
      )}
    >
      {children}
    </NextLink.default>
  );
}
