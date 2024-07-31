'use client'

import { categorizedTiers } from "@/lib/constants/tiers/default-tiers"
import { Button, Title, Text } from "@tremor/react"
import TierCard from "./tier-card"
import { useCallback, useState } from "react";
import { createTemplateTier } from "@/app/services/TierService";
import { useModal } from "../modal/provider";
import { X, CheckSquare2 as CheckSquare, Square } from 'lucide-react';


export default function TierTemplates({ children, multiple }: { children: React.ReactNode, multiple?: boolean }) {
	const { show, hide } = useModal();
	
	// const gotoNewBlankPackage = useCallback(() => {
	// 	window.location.href = '/tiers/new';
	// }, []);

	const header = (
			<Title>Create{multiple ? '' : ' a'} new package{multiple ? 's' : ''}</Title>
	)
    const showModal = () => {
        show(<TiersTemplatesModal hide={hide} multiple={multiple} />, undefined, undefined, header, 'w-full md:w-5/6 max-h-[80vh]');
    };
    return (
        <Button size="xs" onClick={showModal}>{children}</Button>
    )
}

function TiersTemplatesModal({hide, multiple}: { hide: () => void, multiple?: boolean }) {
	
	const [selected, setSelected] = useState<number[]>([]);

	const [creatingTemplateTiers, setCreatingTemplateTiers] = useState(false);
	const [done, setDone] = useState(0);
	const [total, setTotal] = useState(1);
	
	const noun = multiple && selected.length > 1 ? selected.length + " packages from selection" : "package from selection";

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
		const result = await createTemplateTier(index) as any;
		window.location.href = '/tiers/' + result.id;
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
			<div className="flex grow flex-col gap-4 items-stretch justify-start overflow-auto">
				{ categorizedTiers.map((category, cIndex) => (
					<div className="flex flex-col gap-4 p-4" key={cIndex}>
						
						<Title>{category.name}</Title>
						<div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
							{ category.tiers.map(({metaDescription, data : tier}, index) => {
								const determinedIndex = determineIndex(cIndex, index);
								const isSelected = selected.indexOf( determinedIndex ) !== -1;
								return (
									<div 
										key={index} 
										className={"group border bg-gray-100 cursor-pointer relative rounded " + (isSelected  ? "outline" : "") + (multiple  ? "" : " overflow-hidden")} 
										onClick={() => toggleSelected( determinedIndex )}
										>
										{ multiple ? <div className={"absolute -top-2 -right-2 bg-white border p-0 rounded " }>
											{isSelected ? <CheckSquare size={24}/> : <Square size={24} className="text-gray-400"  />}
										</div> : null }
										<div className="p-4 pb-0 flex flex-col gap-4 justify-between items-center aspect-[3/2] overflow-hidden">
											<Text className="text-gray-800">{metaDescription}</Text>
											<svg className="w-full aspect-[100/56]" fill="none" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
												<foreignObject width="320" height="400" className="pointer-events-none">
													<TierCard tier={tier as any}><></></TierCard>
												</foreignObject>
											</svg>
										</div>
										{ !multiple &&
											<div className="bg-white bg-opacity-50 flex justify-center items-center absolute left-0 w-full h-full top-[100%] group-hover:top-[0%] transition-[top]">
												<Button size="xs" onClick={() => {createSingleTemplateTier(determinedIndex)}}>Create a {tier.name} package</Button>
											</div>
										}
									</div>
								)
							})}
						</div>
					</div>
				))}
				
			</div>
			{ multiple ? <div className=" bg-stone-100 h-16 border border-x-0 border-b-0 gap-4 flex p-4 justify-end items-center">
				{ creatingTemplateTiers ?
					
					<ProgressBar done={done} total={total} label={"Creating " + noun} />
					:
					<Button size="xs" onClick={() => createTemplateTiers()} disabled={selected.length === 0}>Create {noun}</Button>
				}
			</div> : null }
		</>
	)
}

function ProgressBar({done, total, label}: {done: number, total: number, label?:string}) {
	return (
		<div className="flex flex-col w-full gap-2">
			{label && <p className="text-sm ">{label}</p>}
			<div className="relative w-full h-2 bg-gray-200 rounded-full">
				<div className="absolute h-2 bg-gray-900 rounded-full transition-[width]" style={{width: `${(done/total)*100}%`}}></div>
			</div>
		</div>
	)

}