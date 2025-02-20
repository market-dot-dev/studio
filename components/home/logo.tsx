import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { domainCopy } from "@/lib/domain";

export default function Logo({
  color = "black",
  className,
}: {
  color?: "black" | "white";
  className?: string;
}) {
  return (
    <Image
      src={
        color === "white"
          ? "/market-dot-dev-logo-white.svg"
          : "/market-dot-dev-logo.svg"
      }
      alt={domainCopy() + " logo"}
      height={32}
      width={164}
      className={clsx(className)}
    />
  );
}
