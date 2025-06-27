import { SharedFeatureList } from "@/components/pricing/shared-feature-list";
import { cn } from "@/lib/utils";

export function FeatureList({ className }: { className?: string }) {
  return <SharedFeatureList className={className} />;
}
