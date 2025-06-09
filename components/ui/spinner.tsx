import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader
      aria-label="Loading"
      className={cn("loading-spinner animate-spin-slow size-3", className)}
    />
  );
}
