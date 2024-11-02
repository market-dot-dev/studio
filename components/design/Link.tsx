import type { LinkProps } from "next/link";
import React from "react";
import * as NextLink from "next/link";
import clsx from "clsx";

type CustomLinkProps = {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
} & LinkProps;

export default function Link({
  className,
  style,
  children,
  ...linkProps
}: CustomLinkProps) {
  return (
    <NextLink.default
      {...linkProps}
      className={clsx(
        "text-[#8C8C88] transition hover:brightness-[80%] active:scale-[99%]",
        className,
      )}
      style={style}
    >
      {children}
    </NextLink.default>
  );
}
