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
      <Link href="https://market.dev" target="_blank">
        <Image
          alt="market.dev logo"
          width={72}
          height={16}
          className="inline h-5 w-auto -translate-y-px sm:h-[19px]"
          src="/market-dot-dev-logo.svg"
          priority
        />
      </Link>
    </span>
  );
}
