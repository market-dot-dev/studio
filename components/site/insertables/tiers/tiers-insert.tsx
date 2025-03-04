'use client';
import { useModal } from "@/components/modal/provider";
import { useState, useEffect, useCallback } from "react";
import { Button, Title } from "@tremor/react";
import { getPublishedTiers } from "@/app/services/TierService";
import LoadingSpinner from "@/components/form/loading-spinner";

type TierProps = {
    id: string;
    name: string;
}

function TiersInsertModal({ insertAtCursor, hide }: { insertAtCursor: (prop: any) => void, hide: () => void}) {
    
    const [tiers, setTiers] = useState<TierProps[] | undefined>();
    const [selectedTiers, setSelectedTiers] = useState<string[]>([]);

    const handleInsertTiers = useCallback(() => {
        insertAtCursor(`<Tiers tiers="${selectedTiers.join(',')}"></Tiers>`);
        hide();
    }, [selectedTiers, insertAtCursor, hide]);

    useEffect(() => {
        getPublishedTiers().then((tiers: TierProps[]) => {
            setTiers(tiers);
            setSelectedTiers([]);
        });
    }, []);

    return (
        <div className="flex flex-col items-start justify-between grow gap-2 p-4">
            <div className="flex flex-col items-stretch justify-start grow gap-2">
                {tiers ? (

                    tiers.length ? tiers.map((tier: TierProps) => {
                        return (
                        
                            <div key={tier.id} className="flex gap-2 justify-start">
                            <input
                                type="checkbox"
                                checked={ selectedTiers?.includes(tier.id) }
                                onChange={(e) => {
                                setSelectedTiers((tiers: any) => {
                                    if(e.target.checked) {
                                        return [...tiers, tier.id]
                                    } else {
                                        return tiers.filter((id: string) => id !== tier.id);
                                    }
                                })}} 
                            />
                            <p className="text-sm text-stone-500">{tier.name}</p>
                            </div>
                        )}) : <p className="text-sm text-stone-500">No tiers found</p>
                    ) : (
                        <LoadingSpinner />
                    )
                }
            </div>
            <Button onClick={handleInsertTiers} disabled={!tiers}>Insert</Button>
        </div>
    )
}

export default function TiersInsert({ insertAtCursor, children }: { insertAtCursor: (prop: any) => void, children: any}) {
    const { show, hide } = useModal();
    const showModal = () => {
        const modalHeader = <div className="grow">
            <Title>Select Tiers to be displayed</Title>
        </div>
        show(<TiersInsertModal insertAtCursor={insertAtCursor} hide={hide} />, undefined, undefined, modalHeader, 'w-1/4 min-h-[50vh]');
    };
    return (
        <div className="p-2 py-4" onClick={showModal}>{children}</div>
    )
}