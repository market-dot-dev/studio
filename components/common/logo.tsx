import { domainCopy } from "@/lib/domain";
import clsx from "clsx";
import Image from "next/image";

export default function Logo({
  color = "black",
  className
}: {
  color?: "black" | "white";
  className?: string;
}) {
  return (
    <Image
      src={color === "white" ? "/studio-logo-white.svg" : "/studio-logo-black.svg"}
      alt={domainCopy() + " logo"}
      height={32}
      width={164}
      className={clsx(className)}
      priority
    />
  );
}
