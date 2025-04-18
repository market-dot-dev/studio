import clsx from "clsx";
import type { LinkProps } from "next/link";
import * as NextLink from "next/link";
import React from "react";

export type CustomLinkProps = {
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  style?: React.CSSProperties;
  className?: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
} & LinkProps;

export default function Link({
  className,
  children,
  variant = "secondary",
  ...props
}: CustomLinkProps) {
  return (
    <NextLink.default
      {...props}
      className={clsx(
        "transition-colors duration-200 ease-in-out",
        variant === "primary"
          ? "text-marketing-primary hover:text-marketing-secondary"
          : "text-marketing-secondary hover:text-marketing-primary",
        className
      )}
    >
      {children}
    </NextLink.default>
  );
}
