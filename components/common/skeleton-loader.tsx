import { cn } from "@/lib/utils";

export default function SkeletonLoader({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-slate-300", className)}></div>;
}
