import type { LinkProps } from "next/link";
import React from "react";
import * as NextLink from "next/link";
import clsx from "clsx";

type CustomLinkProps = {
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
} & LinkProps;

export default function Link({
  className,
  children,
  ...props
}: CustomLinkProps) {
  return (
    <NextLink.default
      {...props}
      className={clsx(
        " transition-all duration-[175ms] hover:text-marketing-primary active:scale-[99%]",
        className,
      )}
    >
      {children}
    </NextLink.default>
  );
}
