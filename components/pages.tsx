
import Image from "next/image";
import { CheckIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import Link from 'next/link';
import { Badge } from "@tremor/react";

export default function Pages({ pages, homepageId, url }: { pages: any, homepageId: string | null, url?: string }) {
	
	return (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Path</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
					<Table.ColumnHeaderCell></Table.ColumnHeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{pages.map((page: any) => (
					page.id != homepageId ? (
						<Table.Row key={page.id} >
							<Table.Cell>{page.title}</Table.Cell>
							<Table.Cell>
								<a
									href={ url + (page.id === homepageId ? '' : `/${page.slug}`) }
									target="_blank"
									rel="noreferrer"
									className="truncate rounded-md bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600"
								>
									{(page.id === homepageId ? '' : `/${page.slug}`)} ↗
								</a>

							</Table.Cell>
							<Table.Cell>
								{page.draft ? 
								<Badge color="gray" size="xs">Draft</Badge> :
								<Badge color="green" size="xs">Live</Badge>}
							</Table.Cell>
							{/* <Table.Cell>{page.id === homepageId ? <CheckIcon /> : null}</Table.Cell> */}
							<Table.Cell><Link href={`/page/${page.id}`}>Edit</Link></Table.Cell>
						</Table.Row>
					) : null
				))}
			</Table.Body>

		</Table.Root>
	)
}
