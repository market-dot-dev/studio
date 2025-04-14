"use client";

import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface MarketPreviewProps {
  username: string;
  baseUrl: string;
}

export default function MarketPreview({ username, baseUrl }: MarketPreviewProps) {
  return (
    <Card className="group relative overflow-hidden bg-muted/40">
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
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
