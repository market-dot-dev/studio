import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ReactNode } from 'react';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { VariantProps } from 'class-variance-authority';

interface PageHeaderProps {
  title: string;
  backLink?: {
    href: string;
    title: string;
  };
  description?: string;
  actions?: ReactNode[];
  status?: {
    title: string;
    variant?: VariantProps<typeof badgeVariants>['variant'];
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
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-5 w-full ${className}`}>
      {backLink && (
        <Link
          href={backLink.href}
          className="group flex w-fit -translate-x-[3px] items-center gap-1 text-sm font-semibold tracking-tightish text-stone-500 transition-colors hover:text-stone-800"
        >
          <ChevronLeft size={16} className="shrink-0 group-hover:-translate-x-px transition-transform" />
          {backLink.title}
        </Link>
      )}
      
      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col flex-grow gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl/8 font-bold tracking-tightish">
              {title}
            </h1>
            {status && (
              <Badge 
                variant={status.variant} 
                tooltip={status.tooltip}
                className="w-fit"
              >
                {status.title}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-sm text-stone-500 max-w-prose text-pretty">
              {description}
            </p>
          )}
        </div>
        
        {actions && actions.length > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions.map((action, index) => (
              <div key={index}>{action}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 