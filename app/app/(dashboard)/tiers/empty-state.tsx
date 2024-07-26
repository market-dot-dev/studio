'use client'

import TierTemplates from "@/components/tiers/tier-templates";



export default function TiersEmptyState() {
	
	return (
		
			<div className="border rounded-lg flex gap-4 min-h-80 justify-between">
				<div className="flex flex-col items-center justify-center p-8 basis-[50%] gap-4">
					<h2 className="text-lg font-semibold text-gray-900">You have no packages defined</h2>
					<p className="text-sm text-gray-500 w-3/4 text-center">You can use our pre-existing package templates to get you started quickly, or you can manually create your first package.</p>
					
						<div className="flex gap-8 justify-around align-center">
							<TierTemplates multiple={true}>Create Packages</TierTemplates>
						</div>
					
				</div>
				<div className="flex flex-col items-center justify-center mt-6 basis-[50%]">
					<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-9"/><path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"/><path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"/><path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"/></svg>
				</div>
			</div>
		
	);
}