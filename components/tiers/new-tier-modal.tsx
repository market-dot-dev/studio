'use client'

import { categorizedTiers } from "@/lib/constants/tiers/default-tiers"
import { Button, buttonVariants } from "@/components/ui/button";
import TierCard from "./tier-card"
import { useCallback, useState } from "react";
import { createTemplateTier } from "@/app/services/TierService";
import { CheckSquare2 as CheckSquare, Square, Plus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

export default function NewTierModal({ children, multiple }: { children: React.ReactNode, multiple?: boolean }) {
	const [open, setOpen] = useState(false);
	
	return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className={buttonVariants({ variant: "default" })}>
          {children}
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] w-full max-w-none overflow-hidden md:max-w-[80vw] p-6 pt-5 md:p-7 md:pt-6 gap-6 md:gap-9">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              Create{multiple ? "" : " a"} new package{multiple ? "s" : ""}
            </DialogTitle>
          </DialogHeader>
          <TiersTemplatesModal
            hide={() => setOpen(false)}
            multiple={multiple}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function TiersTemplatesModal({hide, multiple}: { hide: () => void, multiple?: boolean }) {
	
	const [selected, setSelected] = useState<number[]>([]);

	const [creatingTemplateTiers, setCreatingTemplateTiers] = useState(false);
	const [done, setDone] = useState(0);
	const [total, setTotal] = useState(1);
	const [singleTierInProgress, setSingleTierInProgress] = useState<boolean>(false);
	
	const noun = multiple && selected.length > 1 ? selected.length + " packages from selected templates" : "package from selected template";

	const createTemplateTiers = async (index?: number) => {
		const selectedTiers = [...selected];
		setTotal(selectedTiers.length);
		setCreatingTemplateTiers(true);
		let lastCreatedTierId = null as null | string;

		for( let i = 0; i < selectedTiers.length; i++ ) {
			try {
				const result = await createTemplateTier(selectedTiers[i]) as any;
				lastCreatedTierId = result.id;
				setDone(i + 1);
			} catch (e) {
				console.error(e);
				return;
			}
			
		}
		
		setTimeout(() => {
			if(multiple) {
				window.location.href = '/tiers';
			} else if(lastCreatedTierId) {
				window.location.href = '/tiers/' + lastCreatedTierId;
			}
		}, 500)
		
	}

	const createSingleTemplateTier = async (index: number) => {
		setTotal(1);
		setSingleTierInProgress(true);
		const result = await createTemplateTier(index) as any;
		setDone(1);
		setTimeout(() => {
			window.location.href = '/tiers/' + result.id;
		}, 500)
	}

	const determineIndex = useCallback((categoryIndex : number, rowIndex: number) => {
		let index = 0;
		if( categoryIndex > 0) {
			for( let i = 0; i < categoryIndex; i++) {
				index += categorizedTiers[i].tiers.length;
			}
		}
		return index + rowIndex;
	}, [categorizedTiers])

	const toggleSelected = useCallback((index: number) => {
		if( !multiple) {

		} else  {
			setSelected((prev) => {
				
				if (prev.includes(index)) {
					return prev.filter((i) => i !== index)
				} else {
					return [...prev, index]
				}
			});
		}
	}, [setSelected, multiple]);

	return (
    <>
      <div className="flex grow flex-col items-stretch justify-start gap-6 overflow-auto max-h-[calc(80vh-8rem)]">
        {categorizedTiers.map((category, cIndex) => (
          <div className="flex flex-col gap-2" key={cIndex}>
            <h2 className="text-sm font-semibold">{category.name}</h2>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.tiers.map(({ metaDescription, data: tier }, index) => {
                const determinedIndex = determineIndex(cIndex, index);
                const isSelected = selected.indexOf(determinedIndex) !== -1;
                return (
                  <div
                    key={index}
                    className={
                      "group relative cursor-pointer rounded border bg-stone-100 hover:ring-2 hover:ring-stone-800" +
                      (isSelected ? "outline" : "") +
                      (multiple ? "" : " overflow-hidden")
                    }
                    onClick={() => toggleSelected(determinedIndex)}
                  >
                    {multiple ? (
                      <div
                        className={
                          "absolute -right-2 -top-2 rounded border bg-white p-0"
                        }
                      >
                        {isSelected ? (
                          <CheckSquare size={24} />
                        ) : (
                          <Square size={24} className="text-stone-400" />
                        )}
                      </div>
                    ) : null}
                    <div className="flex aspect-[3/2] flex-col justify-between gap-4 overflow-hidden px-5 pt-4">
                      <p className="text-xs text-stone-500">
                        {metaDescription}
                      </p>
                      <svg
                        className="aspect-[100/56] w-full"
                        fill="none"
                        viewBox="0 0 320 180"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <foreignObject
                          width="320"
                          height="400"
                          className="pointer-events-none overflow-visible"
                        >
                          <TierCard tier={tier as any}>
                            <></>
                          </TierCard>
                        </foreignObject>
                      </svg>
                    </div>
                    {!multiple && (
                      <div className="absolute left-0 top-0 flex h-full w-full cursor-default items-center justify-center bg-white bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          size="icon"
                          onClick={() => {
                            createSingleTemplateTier(determinedIndex);
                          }}
                        >
                          <Plus />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {!multiple && singleTierInProgress ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <div className="w-1/2 rounded-lg border bg-white p-6 shadow-lg">
              <ProgressBar
                done={done}
                total={total}
                label={"Creating " + noun}
              />
            </div>
          </div>
        ) : null}
      </div>
      {multiple ? (
        <div className="flex h-16 items-center justify-end gap-4 bg-stone-100 p-4">
          {creatingTemplateTiers ? (
            <ProgressBar done={done} total={total} label={"Creating " + noun} />
          ) : (
            <Button
              size="icon"
              onClick={() => createTemplateTiers()}
              disabled={selected.length === 0}
            >
              <Plus />
            </Button>
          )}
        </div>
      ) : null}
    </>
  );
}

function ProgressBar({done, total, label}: {done: number, total: number, label?:string}) {
	return (
		<div className="flex flex-col w-full gap-2">
			{label && <p className="text-base">{label}</p>}
			<div className="relative w-full h-2 bg-stone-200 rounded-full">
				<div className="absolute h-2 bg-stone-900 rounded-full transition-[width]" style={{width: `${(done/total)*100}%`}}></div>
			</div>
		</div>
	)
}