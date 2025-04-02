import { Loader } from 'lucide-react';
import React from 'react'
import { cn } from '@/lib/utils';

export default function Spinner({ className, ...props }: React.ComponentProps<typeof Loader> & { className?: string }) {
  return <Loader className={cn("loading-spinner animate-spin-slow h-3 w-3", className)} {...props} />;
}
