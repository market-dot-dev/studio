'use client'

import { getDependentPackages, getDependentPackagesFacets, getPackages } from "@/app/services/LeadsService";
import { getRepos } from "@/app/services/RepoService";

import { BarChart, Card, Select, SelectItem, Tab, TabGroup, TabList } from "@tremor/react";
import { useCallback, useEffect, useMemo, useState } from "react"


type RepoItem = {
	radarId : number,
	name: string
}

const versionLabels = {
	"resolved_major_versions": "Major",
	"resolved_minor_versions": "Minor",
	"resolved_patch_versions": "Patch"
} as any

export default function DependentPackages() {
	
	const [repos, setRepos] = useState<RepoItem[]>([]);
	const [packages, setPackages] = useState<any[]>([]);
	const [selectedPackage, setSelectedPackage] = useState<any>(null);

	const [dependentPackages, setDependentPackages] = useState<any[]>([]);

	const [ selectedVersion, setSelectedVersion ] = useState<string | null>();

	const [ allData, setAlldata ] = useState<any>(null);

	const [tabIndex, setTabIndex] = useState<number>(0);



	const chartData = useMemo(() => {
		if (!allData ) return [];
		
		const versionType = Object.keys(allData)[tabIndex];

		const versionData = allData[versionType];
		const data = versionData.map((item: [string, number]) => {
			const [version, count ] = item;
			return {
				version,
				count
			}
		});
		console.log('memoized data', data)
		return data;
	}, [allData, tabIndex]);

	

	const getPackagesForRadarId = useCallback((e: string) => {
		
		getPackages(parseInt(e)).then((res) => {
			let packages = res.data;
			
			packages.sort((a: any, b: any) => {
				return b.metadata.rankings.average - a.metadata.rankings.average;
			});

			
			// get the dependent packages for the first package
			if(packages.length) {
				getDependentsForPackageId(`${packages[0].id}`)
			}

			setPackages(packages);
		});
		
		
	}, [setPackages]);

	const getDependentsForPackageId = useCallback((e: string) => {
		setSelectedPackage(e);
		getDependentPackagesFacets(parseInt(e)).then((res) => {
			console.log('got dependent packages', res.data)
			setAlldata(res.data);
		})
	}, [setAlldata]);

	const getVersionDependents = useCallback((e: any) => {
		if( !e ) return;

		const key = Object.keys(allData)[tabIndex];
		const value = e.version;

		getDependentPackages(parseInt(selectedPackage), {[key] : value}).then((res) => {
			setDependentPackages(res.data);
		})

	}, [allData, tabIndex, selectedPackage]);

	useEffect(() => {
		getRepos().then(data => {
			const repos = data.map(repo => ({
					radarId: repo.radarId,
					name: repo.name
				})
			) as RepoItem[];

			// fetch the packages for the first repo
			if (repos.length) {
				getPackagesForRadarId(`${repos[0].radarId}`);
			}

			setRepos(repos);
		
		});
		
	}, [])

{/* <TabGroup
              defaultIndex={PREVIEW_INDEX}
              onIndexChange={(index) => setIsPreview(index === PREVIEW_INDEX)}
            >
              <TabList variant="solid" className="font-bold">
                <Tab className={isPreview ? "bg-white" : ""} icon={EyeOpenIcon}>
                  Preview
                </Tab>
                <Tab className={isPreview ? "" : "bg-white"} icon={CodeIcon}>
                  Code
                </Tab>
              </TabList> */}

	return (
		<div>
			<div className="flex gap-6">
				{ repos.length ?
					<div className="flex gap-2 items-center">
						<label>Repo</label>
						<Select 
							defaultValue={`${repos[0]!.radarId}`}
							onValueChange={getPackagesForRadarId}
						>
							{ repos.map(repo => (
								<SelectItem value={`${repo.radarId}`}>{repo.name}</SelectItem>
							))}
						</Select>
					</div>
					: null
				}
				{ packages.length ?
					<div className="flex gap-2 items-center">
						<label>Package</label>
						<Select
							// defaultValue={`${selectedPackage ?? packages[0]!.id}`}
							value={selectedPackage ?? packages[0]!.id}
							onValueChange={getDependentsForPackageId}
						>
							{ packages.map(pkg => (
								<SelectItem value={`${pkg.id}`}>{pkg.name}</SelectItem>
							))}
						</Select>
					</div>
					: null
				}
				{ allData  ?
					<TabGroup
						defaultIndex={tabIndex}
						onIndexChange={setTabIndex}
						>
						<TabList variant="solid">
							{ Object.keys( allData ).map((key: string, index: number) => (
								<Tab value={key} className={tabIndex === index ? "bg-white" : ""} >{versionLabels[key]}</Tab>
							))}
						</TabList>
					</TabGroup>
					: null
				}
			</div>

			<BarChart
                className="h-72 mt-4"
                data={chartData}
                index="version"
                categories={["count"]}
                colors={["gray-400"]}
                yAxisWidth={30}
				onValueChange={getVersionDependents}

              />
			  <div className="flex flex-col gap-4">
				  { dependentPackages.map((pkg) => (
					  <Card>
						<div className="font-bold text-xl mb-2">{pkg.name}</div>
					  </Card>
				  ))}
			  </div>
			  
		</div>
	)
}