import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function BrandBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex gap-2 text-sm font-semibold tracking-tight text-stone-500",
        className
      )}
    >
      Powered by
      <Link href="https://studio.market.dev" target="_blank">
        <Image
          alt="Studio by market.dev logo"
          width={68}
          height={21}
          className="inline h-[21px] w-[68px] -translate-y-px"
          src="/studio-logo-black.svg"
          priority
        />
      </Link>
    </span>
  );
}
