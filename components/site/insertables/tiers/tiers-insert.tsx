'use client';
import { useModal } from "@/components/modal/provider";
import { useState, useEffect, useCallback } from "react";
import { Button, Flex,  Title, Text } from "@tremor/react";
import { X } from 'lucide-react';
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
            setSelectedTiers(tiers.map((tier: any) => tier.id))
        });
    }, []);

    return (
        
            
            <Flex flexDirection="col" alignItems="start" justifyContent="between" className="grow gap-2 p-4">
                <Flex flexDirection="col" alignItems="stretch" justifyContent="start" className="grow gap-2">
                    
                    {
                    tiers ?
                        tiers.length ? tiers.map((tier: TierProps) => {
                            return (
                            
                                <Flex key={tier.id} className="gap-2" justifyContent="start">
                                <input
                                    type="checkbox"
                                    checked={ selectedTiers?.includes(tier.id) }
                                    onChange={(e) => {
                                    setSelectedTiers((tiers: any) => {
                                        if(e.target.checked) {
                                        return [...tiers, tier.id]
                                        } else {
                                        
                                        let newTiers = tiers.filter((id: string) => id !== tier.id);
                                        if(newTiers.length === 0) {
                                            return tiers;
                                        }
                                        return newTiers
                                        }
                                    })
                                    }} 
                                    />
                                <Text>{tier.name}</Text>
                                </Flex>

                            )
                            })
                            : <Text>No tiers found</Text>
                        : 
                        
                        <LoadingSpinner />
                    }
                </Flex>
                <Button onClick={handleInsertTiers} disabled={!tiers}>Insert</Button>
            </Flex>
            
            
        
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