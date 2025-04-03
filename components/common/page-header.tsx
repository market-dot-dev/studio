import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { VariantProps } from 'class-variance-authority';

interface PageHeaderProps {
  title: ReactNode | string;
  backLink?: {
    href: string;
    title: string;
  };
  description?: ReactNode | string;
  actions?: ReactNode[];
  status?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  backLink,
  description,
  actions,
  status,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`flex w-full flex-col gap-5 ${className}`}>
      {backLink && (
        <Link
          href={backLink.href}
          className="group flex w-fit -translate-x-[3px] items-center gap-1 text-sm font-semibold tracking-tightish text-stone-500 transition-colors hover:text-stone-800"
        >
          <ChevronLeft
            size={16}
            className="shrink-0 transition-transform group-hover:-translate-x-px"
          />
          {backLink.title}
        </Link>
      )}

      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="flex flex-grow flex-col gap-2">
          <div className="inline-flex items-center gap-3">
            <h1 className="text-3xl/8 font-bold tracking-tightish">{title}</h1>
            {status && (
              <div className="w-fit translate-y-px">
                {status}
              </div>
            )}
          </div>
          {description && (
            <p className="max-w-prose text-pretty text-sm text-stone-500">
              {description}
            </p>
          )}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
} 