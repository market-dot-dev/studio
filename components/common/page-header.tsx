import { Badge, badgeVariants } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode | string;
  backLink?: {
    href: string;
    title: string;
  };
  description?: ReactNode | string;
  actions?: ReactNode[];
  status?: {
    title: string;
    variant?: VariantProps<typeof badgeVariants>["variant"];
    tooltip?: string;
  };
  className?: string;
}

export default function PageHeader({
  title,
  backLink,
  description,
  actions,
  status,
  className = ""
}: PageHeaderProps) {
  return (
    <div className={`flex w-full flex-col gap-5 ${className}`}>
      {backLink && (
        <Link
          href={backLink.href}
          className="tracking-tightish group flex w-fit translate-x-[-3px] items-center gap-1 text-sm font-semibold text-stone-500 transition-colors hover:text-stone-800"
        >
          <ChevronLeft
            size={16}
            className="shrink-0 transition-transform group-hover:-translate-x-px"
          />
          {backLink.title}
        </Link>
      )}

      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="flex grow flex-col gap-2">
          <div className="inline-flex items-center gap-3">
            <h1 className="tracking-tightish text-3xl/8 font-bold">{title}</h1>
            {status && (
              <Badge
                variant={status.variant}
                tooltip={status.tooltip}
                className="w-fit translate-y-0.5"
              >
                {status.title}
              </Badge>
            )}
          </div>
          {description && (
            <p className="max-w-prose text-pretty text-sm text-stone-500">{description}</p>
          )}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}
