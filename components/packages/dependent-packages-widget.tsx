import { Button, Card } from "@tremor/react";
import DependentPackages, { RepoItem } from "./dependent-packages";
import Link from "next/link";

export default function DependentPackagesWidget({ repos }: { repos: RepoItem[] }) {
	return (
		<div className="flex flex-col gap-4">
			<Card className="pt-0">
				<DependentPackages repos={repos} compact={true} />
			</Card>
			<Link href='/reports?tab=repos' className="ml-auto">
				<Button size="xs" className="h-6" variant="secondary">
				More Details →
				</Button>
			</Link>
		</div>
	)
}