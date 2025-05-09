"use client";

import { TierDescriptionFeatures } from "@/components/tiers/tier-description-features";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { parseTierDescription } from "@/lib/utils";
import { Tier } from "@prisma/client";
import { Info } from "lucide-react";
import { useState } from "react";

interface TierDetailsModalProps {
  tier: Tier | null;
  triggerClassName?: string;
}

export function TierDetailsModal({ tier, triggerClassName }: TierDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!tier) {
    return null;
  }

  const parsedDescription = parseTierDescription(tier.description || "");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={triggerClassName}
          aria-label="See package details"
          tooltip="See package details"
        >
          <Info strokeWidth={2.5} className="!size-3.5 text-stone-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100vh-32px)] max-w-[calc(100vw-32px)] rounded-lg sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>{tier.name}</DialogTitle>
          {tier.tagline && <DialogDescription>{tier.tagline}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-2 text-sm ">
          <Separator />
          <div className="flex flex-wrap items-center justify-between">
            <p className="text-xxs/5 font-semibold uppercase tracking-wide text-stone-500">Price</p>{" "}
            <p className="font-medium">
              ${tier.price} / {tier.cadence}
            </p>
          </div>
          <Separator />
          {tier.priceAnnual !== null && tier.priceAnnual !== undefined && (
            <>
              <div className="flex flex-wrap items-center justify-between">
                <p className="text-xxs/5 font-semibold uppercase tracking-wide text-stone-500">
                  Annual Price
                </p>
                <p className="font-medium">${tier.priceAnnual} / year</p>
              </div>
              <Separator />
            </>
          )}
          {tier.description && (
            <div className="flex flex-col gap-4">
              <p className="text-xxs/5 font-semibold uppercase tracking-wide text-stone-500">
                Description
              </p>
              <div className="flex flex-col gap-4">
                {parsedDescription.map((section, dex) => {
                  if (section.text) {
                    return (
                      <div key={dex}>
                        {section.text.map((text: string, index: number) => (
                          <p key={index}>{text}</p>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <TierDescriptionFeatures
                      key={dex}
                      features={section.features.map((feature: string, index: number) => ({
                        id: index,
                        name: feature
                      }))}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
