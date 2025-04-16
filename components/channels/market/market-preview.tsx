"use client";

import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface MarketPreviewProps {
  username: string;
  baseUrl: string;
}

export default function MarketPreview({ username, baseUrl }: MarketPreviewProps) {
  return (
    <Card className="bg-muted/40 group relative overflow-hidden">
      <div className="bg-background/80 pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
        <div className="text-muted-foreground flex flex-col items-center gap-2">
          <Lock className="size-8" />
          <p className="text-sm font-medium">Preview Only</p>
        </div>
      </div>
      <iframe
        src={`${baseUrl}/experts/${username}`}
        className="pointer-events-none h-[700px] w-full border-none"
        title="Market Preview"
        aria-label="Preview of your Market page"
      />
    </Card>
  );
}
