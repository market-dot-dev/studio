'use client';

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { getPublishedTiers } from "@/app/services/TierService";
import Spinner from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

type TierProps = {
    id: string;
    name: string;
}

export default function TiersInsert({ insertAtCursor, children }: { insertAtCursor: (prop: any) => void, children: any}) {
    const [isOpen, setIsOpen] = useState(false);
    const [tiers, setTiers] = useState<TierProps[] | undefined>();
    const [selectedTiers, setSelectedTiers] = useState<string[]>([]);

    const handleInsertTiers = useCallback(() => {
        insertAtCursor(`<Tiers tiers="${selectedTiers.join(',')}"></Tiers>`);
        setIsOpen(false);
    }, [selectedTiers, insertAtCursor]);

    useEffect(() => {
        if (isOpen) {
            getPublishedTiers().then((tiers: TierProps[]) => {
                setTiers(tiers);
                setSelectedTiers([]);
            });
        }
    }, [isOpen]);
    
    return (
      <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="p-2 py-4">{children}</DialogTrigger>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle>Pick Tiers</DialogTitle>
            </DialogHeader>
            <div className="flex grow flex-col items-start justify-between gap-2">
              <div className="flex w-full grow flex-col items-stretch justify-start gap-2">
                {tiers ? (
                  tiers.length ? (
                    tiers.map((tier: TierProps) => {
                      return (
                        <Checkbox
                          key={tier.id}
                          id={`tier-${tier.id}`}
                          label={tier.name}
                          checked={selectedTiers?.includes(tier.id)}
                          onCheckedChange={(checked) => {
                            setSelectedTiers((tiers: any) => {
                              if (checked) {
                                return [...tiers, tier.id];
                              } else {
                                return tiers.filter(
                                  (id: string) => id !== tier.id,
                                );
                              }
                            });
                          }}
                        />
                      );
                    })
                  ) : (
                    <p className="text-sm text-stone-500">No tiers found</p>
                  )
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleInsertTiers}
                disabled={!tiers || selectedTiers.length === 0}
              >
                Insert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
}