import { Building } from "lucide-react";

export default function DescriptionToTiersVisualization() {
  return (
    <div className="relative flex w-fit items-center justify-between gap-3">
      {/* Description Box Preview */}
      <div className="relative">
        <div className="aspect-video h-10 rounded-sm bg-background p-2 shadow-border">
          <div className="space-y-1">
            <div className="h-1 w-full rounded-sm  bg-stone-200" />
            <div className="h-1 w-full rounded-sm  bg-stone-200" />
            <div className="h-1 w-1/2 rounded-sm bg-stone-200" />
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-[2px] bg-white shadow ring-1 ring-black/15">
          <Building size={14} className="text-muted-foreground" />
        </div>
      </div>

      <div className="h-px w-10 border-t border-dashed border-muted-foreground/50" />

      {/* Tier Cards Preview */}
      <div>
        <div className="flex -translate-y-1 items-center justify-center">
          <div className="-mr-6 mt-2 h-14 w-10 -rotate-6 rounded-[3px] bg-white shadow-border" />
          <div className="z-[1] h-16 w-12 rounded-[3px] bg-white shadow-border-md" />
          <div className="-ml-6 mt-2 h-14  w-10 rotate-6 rounded-[3px] bg-white shadow-border" />
        </div>
      </div>
    </div>
  );
}
