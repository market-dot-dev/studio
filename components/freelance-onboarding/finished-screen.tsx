"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Package, Scan } from "lucide-react";
import Image from "next/image";

interface FinishedScreenProps {
  onGoToDashboard: () => void;
}

export function FinishedScreen({ onGoToDashboard }: FinishedScreenProps) {
  return (
    <div className="mx-auto max-w-lg space-y-8 duration-500 animate-in fade-in-0 slide-in-from-bottom-4">
      <div className="flex justify-center">
        <Image
          src="/gw-logo-nav.png"
          alt="Gitwallet Logo"
          className="size-9 shrink-0"
          height={36}
          width={36}
          priority
        />
      </div>
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">
          You're all set up and ready to use your dashboard!
        </h1>
        <p className="text-sm text-stone-600">Here's what you're going to do next:</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="relative z-10 flex size-8 items-center justify-center rounded-full bg-primary/10">
                <Scan className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-foreground">Review packages</span> by adding
                your own contract or a pre-vetted market.dev contract.
              </div>
            </div>
            {/* Step 2 (optional) */}
            <div className="flex items-start gap-4">
              <div className="relative z-10 flex size-8 items-center justify-center rounded-full bg-primary/10">
                <Brain className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-foreground">Create your landing page</span>{" "}
                <span className="ml-2 rounded bg-stone-100 px-2 py-0.5 align-middle text-xs font-medium text-stone-600">
                  optional
                </span>
                <div className="mt-1 text-sm text-stone-600">
                  Use the full screen editor and default templates to make your own website and
                  start selling immediately with a custom domain or a custom market.dev domain.
                </div>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="relative z-10 flex size-8 items-center justify-center rounded-full bg-primary/10">
                <Package className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-foreground">Share your tiers</span> by copying
                our checkout link or using our tier embeds.
              </div>
            </div>
            {/* Step 4 (optional) */}
            <div className="flex items-start gap-4">
              <div className="relative z-10 flex size-8 items-center justify-center rounded-full bg-primary/10">
                <Package className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-foreground">
                  List on the market.dev explorer marketplace
                </span>{" "}
                <span className="ml-2 rounded bg-stone-100 px-2 py-0.5 align-middle text-xs font-medium text-stone-600">
                  optional
                </span>
                <div className="mt-1 text-sm text-stone-600">Sell yourself in a new channel.</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button className="mt-4 w-full" size="lg" onClick={onGoToDashboard}>
        Go to Dashboard
      </Button>
    </div>
  );
}
