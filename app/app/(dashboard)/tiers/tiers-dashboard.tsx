'use client'

import TiersTemplates from "@/components/tiers/tiers-templates";
import { Button } from "@tremor/react"
import { useState } from "react";

export default function TiersDashboard({titleArea, tiers, children}: {titleArea: React.ReactNode, tiers: any, children: React.ReactNode}) {
	const [templatesOpen, setTemplatesOpen] = useState(false);
	return (
		<>
			<div className="flex justify-between items-center">
				{titleArea}
				{ tiers.length > 0 && !templatesOpen ?
				<div className="flex flex-row">
					<Button size="xs" onClick={() => setTemplatesOpen(true)}>New Package</Button>
				</div> : null }
			</div>
			<TiersTemplates open={templatesOpen} setOpen={setTemplatesOpen} multiple={false}>
				{children}
			</TiersTemplates>
		</>
	)
}