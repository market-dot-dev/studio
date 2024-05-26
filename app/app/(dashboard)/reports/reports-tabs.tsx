'use client'

import AllCharts from "@/components/overview-stats"
import DependentPackages, { RepoItem } from "@/components/packages/dependent-packages"
import { TabGroup, TabList, Tab, TabPanels, TabPanel, Text, Badge } from "@tremor/react"
import { useState } from "react";

export default function ReportsTabs({repos} : {repos: RepoItem[]}) {
	
	const [tabIndex, setTabIndex] = useState<number>(0);

	return (
		<TabGroup defaultIndex={tabIndex} onIndexChange={setTabIndex}>
			<TabList variant="solid" className="bg-white font-medium flex space-x-4 border-b border-stone-200 pb-4 pt-2 dark:border-stone-700">
				<Tab className={ "py-1 text-stone-600 " + (tabIndex === 0 ? "bg-stone-100" : "")}>Repos</Tab>
				<Tab className={ "py-1 text-stone-600 " + (tabIndex === 1 ? "bg-stone-100" : "")}>Revenue</Tab>
			</TabList>
			<TabPanels className="pt-6">
				<TabPanel>
				<DependentPackages repos={repos} />
				</TabPanel>
				<TabPanel>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Text>Your revenue & customer reports.</Text>
						<Badge>Coming Soon</Badge>
					</div>
					<AllCharts />
				</div>
				</TabPanel>
			</TabPanels>
		</TabGroup>
	)
}