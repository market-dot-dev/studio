'use client'

import PrimaryButton from "@/components/common/link-button";
import { createDefaultTier } from "@/app/services/TierService";
import { useState } from "react";

function ProgressBar({done, total, label}: {done: number, total: number, label?:string}) {
	return (
		<div className="flex flex-col w-full gap-2">
			{label && <p className="text-sm text-gray-500">{label}</p>}
			<div className="relative w-full h-2 bg-gray-200 rounded-full">
				<div className="absolute h-2 bg-gray-900 rounded-full transition-[width]" style={{width: `${(done/total)*100}%`}}></div>
			</div>
		</div>
	)

}

export default function TiersEmptyState() {
	const [creatingSampleTiers, setCreatingSampleTiers] = useState(false);
	const [done, setDone] = useState(0);
	const [total, setTotal] = useState(1);

	const createSampleTiers = async (index?: number) => {
		setCreatingSampleTiers(true);
		let result = await createDefaultTier(index) as any;
		setDone(result.nextIndex);
		setTotal(result.total);
		if (result.nextIndex < result.total) {
			await createSampleTiers(result.nextIndex)
		} else {
			setTimeout(() => {
				window.location.href = '/tiers';
			}, 500)
		}
	}
	return (
		<div className="border rounded-lg flex gap-4 min-h-80 justify-between">
			<div className="flex flex-col items-center justify-center p-8 basis-[50%] gap-4">
				<h2 className="text-lg font-semibold text-gray-900">You have no packages defined</h2>
				<p className="text-sm text-gray-500 w-3/4 text-center">Get started by either importing sample packages, or you can manually create your first package.</p>
				{ creatingSampleTiers ?
				
					<ProgressBar done={done} total={total} label="Importing sample packages" />
				:
					<div className="flex gap-8 justify-around align-center">
						<button onClick={() => createSampleTiers()} className={(creatingSampleTiers ? 'opacity-50 pointer-events-none cursor-not-allowed' : '') +" text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 "}>Import Sample Packages</button>
						<PrimaryButton disabled={creatingSampleTiers} label="Create Package" href="/tiers/new" />
					</div>
				}
				
			</div>
			<div className="flex flex-col items-center justify-center mt-6 basis-[50%]">
				<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-9"/><path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"/><path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"/><path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"/></svg>
			</div>
		</div>
	);
}