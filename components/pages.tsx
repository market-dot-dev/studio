
import Image from "next/image";
import { CheckIcon } from "@radix-ui/react-icons";
import { Table } from "@radix-ui/themes";
import Link from 'next/link';
import { Badge } from "@tremor/react";
import DomainService from "@/app/services/domain-service";
export default function Pages({ pages, homepageId, subdomain }: { pages: any, homepageId: string | null, subdomain: string | null }) {
	// const url = `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
	const url = DomainService.getRootUrl(subdomain ?? 'app');
	return pages.length > 0 ? (
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
	) : (
		<div className="flex flex-col items-center space-x-4">
			<h1 className="font-cal text-4xl">No Posts Yet</h1>
			<Image
				alt="missing pages"
				src="https://illustrations.popsy.co/gray/graphic-design.svg"
				width={400}
				height={400}
			/>
			<p className="text-lg text-stone-500">
				You do not have any pages yet. Create one to get started.
			</p>
		</div>
	);
}
