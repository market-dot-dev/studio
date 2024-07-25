'use client'

import { categorizedTiers } from "@/lib/constants/tiers/default-tiers"
import { Button, Title, Text } from "@tremor/react"
import TierCard from "./tier-card"
import { useCallback, useEffect, useState } from "react";
import { createTemplateTier } from "@/app/services/TierService";
import PrimaryButton from "../common/link-button";


export default function TiersTemplates({open, setOpen, multiple, children}: {open: boolean, multiple?: boolean, setOpen: any, children: React.ReactNode}) {
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
		setSelected((prev) => {
			if (!multiple) {
				return prev.includes(index) ? [] : [index]
			}
			if (prev.includes(index)) {
				return prev.filter((i) => i !== index)
			} else {
				return [...prev, index]
			}
		});
	}, [setSelected, multiple]);

	

	useEffect(() => {
		if (!open) {
			setSelected([])
		}
	}, [open])

	return (
		<>
		{ open ?
			<div className="flex flex-col gap-6 items-stretch">
				<div className="flex justify-between items-center">
					<div className="flex flex-col gap-4">
						<Title>Create new package(s)</Title>
						<Text>Get started with a blank slate</Text>
						<PrimaryButton label="Crete a blank package" href="/tiers/new" />
						<Text>or</Text>
						<Text>Use the templates below to get started quickly</Text>
					</div>
				</div>
				<div className="border flex flex-col gap-4 items-stretch justify-start">
					{ categorizedTiers.map((category, cIndex) => (
						<div className="flex flex-col gap-4 p-4" key={cIndex}>
							<Title>{category.name}</Title>
							<div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
								{ category.tiers.map((tier, index) => (
									<div 
										key={index} 
										className={"border p-4 bg-gray-100 cursor-pointer flex flex-col gap-4 items-center " + (selected.indexOf( determineIndex(cIndex, index) ) !== -1  ? "bg-gray-300" : "")} 
										onClick={() => toggleSelected( determineIndex(cIndex, index) )}
										>
										<svg width="200" height="312" fill="none"  viewBox="0 0 320 500" xmlns="http://www.w3.org/2000/svg">
											<foreignObject width="320" height="500" className="pointer-events-none">
												<TierCard tier={tier as any} />
											</foreignObject>
										</svg>
									</div>
								))}
							</div>
						</div>
					))}
					<div className=" bg-stone-100 h-16 border border-x-0 border-b-0 gap-4 flex sticky bottom-0 px-4 justify-end items-center">
					{ creatingTemplateTiers ?
						
						<ProgressBar done={done} total={total} label={"Creating " + noun} />
						:
						<>
							<Button size="xs" onClick={() => setOpen(false)}>Close</Button>
							<Button size="xs" onClick={() => createTemplateTiers()} disabled={selected.length === 0}>Create {noun}</Button>
						</>
					}
					</div>
				</div>
			</div>
			:
			<>
			{children}
			</>
		}
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