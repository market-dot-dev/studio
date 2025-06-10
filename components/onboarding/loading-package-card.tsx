import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingPackageCard({ delay = 0 }: { delay?: number }) {
  return (
    <Card
      className="flex size-full h-full max-w-[300px] animate-pulse flex-col justify-between p-6 shadow-border"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-full bg-primary/5" />
        </div>
        <Skeleton className="h-10 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-3/4 bg-primary/5" />
          <Skeleton className="h-3 w-3/4 bg-primary/5" />
          <Skeleton className="h-3 w-3/4 bg-primary/5" />
          <Skeleton className="h-3 w-3/4 bg-primary/5" />
        </div>
      </div>
      <Skeleton className="mt-8 h-9 w-full md:h-8" />
    </Card>
  );
}
