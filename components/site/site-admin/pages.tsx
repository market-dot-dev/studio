"use client"

import { Page, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

export default function Pages({ pages, homepageId, url }: { pages: any, homepageId: string | null, url?: string }) {
	// Filter out the homepage from the list if necessary
	const filteredPages = pages.filter((page: any) => page.id !== homepageId)
	
	// Map the data to match our Page type
	const data = filteredPages.map((page: any) => ({
		id: page.id,
		title: page.title,
		slug: page.slug,
		draft: page.draft
	})) as Page[]
	
	return <DataTable 
		columns={columns} 
		data={data} 
		meta={{ homepageId: homepageId || undefined, url }}
	/>
} 