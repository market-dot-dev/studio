'use client'

import { getDependentPackages, getDependentPackagesFacets, getPackages } from "@/app/services/LeadsService";
import { Repo } from "@prisma/client";
import { Badge, BarChart, Button, Card, Select, SelectItem, Tab, TabGroup, TabList } from "@tremor/react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import LoadingSpinner from "../form/loading-spinner";

export type RepoItem = Partial<Repo>;

const versionLabels = {
	"resolved_major_versions": "Major",
	"resolved_minor_versions": "Minor",
	"resolved_patch_versions": "Patch"
} as any

// compact means that we do not fetch and display list of dependent packags when a version is selected on the chart
export default function DependentPackages({ repos, compact = false }: { repos: RepoItem[], compact?: boolean}) {
	
	const [packages, setPackages] = useState<any[]>([]);
	const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
	const [dependentPackages, setDependentPackages] = useState<any[]>([]);
	//   const [selectedVersion, setSelectedVersion] = useState<string | null>();
	const [allData, setAlldata] = useState<any>(null);
	const [tabIndex, setTabIndex] = useState<number>(0);

	const [isPendingDependents, startDependentsTransition] = useTransition();
	const [isPendingPackages, startPackagesTransition] = useTransition();

	const chartData = useMemo(() => {
		if (!allData) return [];
		const versionType = Object.keys(allData)[tabIndex];
		const versionData = allData[versionType];
		const data = versionData.map((item: [string, number]) => {
			const [version, count] = item;
			return {
				version: 'v' + version,
				"Dependent Packages": count,
			}
		});

		// repeat data 3 times
		// return [...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data];

		return data;
	}, [allData, tabIndex]);

	const getPackagesForRadarId = useCallback((e: string) => {
		
		// clear the dropdowns
		setPackages([]);
		setDependentPackages([]);

		startPackagesTransition(() => {
			getPackages(parseInt(e)).then((res) => {
				
				let { packages, facets, most_popular_package_id } = res.data;
				
				if (packages && packages.length) {
					
					packages?.sort((a: any, b: any) => {
						return b.metadata.rankings.average - a.metadata.rankings.average;
					});

					setPackages(packages);
					setAlldata(facets);
					setSelectedPackage(`${most_popular_package_id}`);
					// getDependentsForPackageId(`${most_popular_package_id}`)
				}
			});
		});
	}, [setPackages, setDependentPackages, setSelectedPackage]);

	const getDependentsForPackageId = useCallback((e: string) => {
		if( selectedPackage === e ) return;
		
		console.log('getting dependent package facets for', e)
		setSelectedPackage(e);

		startDependentsTransition(() => {
			getDependentPackagesFacets(parseInt(e)).then((res) => {
				setAlldata(res.data);
			});
		});
	}, [setAlldata, setSelectedPackage, selectedPackage]);

	const getVersionDependents = useCallback((e: any) => {
		if (compact || !e || !selectedPackage) return;
		console.log('getting version dependents for', e)
		setDependentPackages([]);
		const key = Object.keys(allData)[tabIndex];
		const value = e.version;

		startDependentsTransition(() => {
			getDependentPackages(parseInt(selectedPackage), { [key]: value.replace('v', '') }).then((res) => {
				setDependentPackages(res.data);
			});
		});
	}, [allData, tabIndex, selectedPackage, compact]);

	useEffect(() => {
		if (repos.length) {
			getPackagesForRadarId(`${repos[0].radarId}`);
		}
	}, [repos])

	const chartSection = (
		<>
		{ isPendingPackages ?
			<div className="flex w-full justify-center items-center"><LoadingSpinner /></div>
			: 
			<BarChart
				className="h-72 mt-4 mx-auto pt-0"
				style={{ width: `max(30%, min(${chartData.length * 100}px, 100%))`}}
				data={chartData}
				index="version"
				categories={["Dependent Packages"]}
				colors={["gray-400"]}
				yAxisWidth={30}
				autoMinValue={true}
				customTooltip={ compact ? undefined : CustomTooltip}

				onValueChange={getVersionDependents}
			/>
		}
		</>
	)

	return (
		<div className="mt-6 flex flex-col items-stretch gap-6">
			
			<div className="grid gap-6 grid-cols-3 relative z-20">
				
				<div className="flex gap-2 items-center">
					<label>Repo</label>
					<Select
						defaultValue={`${repos[0]?.radarId ?? ''}`}
						onValueChange={getPackagesForRadarId}
					>
						{repos.map((repo: RepoItem) => (
							<SelectItem key={repo.radarId} value={`${repo.radarId}`}>{repo.name}</SelectItem>
						))}
					</Select>
				</div>
				
				
				<div className="flex gap-2 items-center">
					<label>Package</label>
					<Select
						value={selectedPackage ?? (packages.length ? packages[0].id : '')}
						onValueChange={getDependentsForPackageId}
					>
						{packages.map(pkg => (
							<SelectItem key={pkg.id} value={`${pkg.id}`}>{pkg.name}</SelectItem>
						))}
					</Select>
				</div>
				<div>
					{allData ?
						<TabGroup
							defaultIndex={tabIndex}
							onIndexChange={(index: number) => {
								setDependentPackages([]);
								setTabIndex(index);
							}}
						>
							<TabList variant="solid">
								{Object.keys(allData).map((key: string, index: number) => (
									<Tab value={key} key={index} className={tabIndex === index ? "bg-white" : ""} >{versionLabels[key]}</Tab>
								))}
							</TabList>
						</TabGroup>
						: null
					}
				</div>
			</div>

			{/* on home page, dont use card */}
			{ compact ? chartSection :
				<Card className={"bg-white z-10 min-h-12 w-full" + ( chartData.length ? ' sticky top-0' : '')}>
					{chartSection}
				</Card>
			}
			{ chartData.length ?
				<div className="flex flex-col gap-4 mt-6">
					{isPendingDependents &&
						<div className="mx-auto"><LoadingSpinner /></div>
					}
					{dependentPackages.map((data) => (
						<PackageCard key={data.id} data={data} />
					))}
				</div>
				: null
			}
		</div>
	)
}

function PackageCard({ data }: { data: any }) {
	const [showAllVersions, setShowAllVersions] = useState(false);

	const toggleVersions = () => {
		setShowAllVersions(!showAllVersions);
	};

	const versions = Object.keys(data.versions) || [];
	const displayVersions = showAllVersions ? versions : versions.slice(0, 10);

	return (
		<Card key={data.id}>
			<a href={data.registry_url ?? ''} className="text-blue-600 text-lg font-bold mb-2 block">
				{data.name}
			</a>
			<p className="text-gray-700 mb-2">{data.description ?? ''}</p>
			<p className="text-gray-700 mb-2">
				Latest release: {data.latest_release_number ?? ''} ({new Date(data.latest_release_published_at).toLocaleDateString()})
			</p>
			<p className="text-gray-700 mb-2">Downloads: {data.downloads ?? 0}</p>
			<p className="text-gray-700 mb-2">Resolved versions: {versions.length > 0 ? versions[0] : "N/A"}</p>
			<p className="text-gray-700">
				Versions: {displayVersions.map((version: string, index: number) => (
					<Badge key={index} className="m-1">{version}</Badge>
				))}
				{versions.length > 10 && (
					<Button size="xs" variant="light" onClick={toggleVersions}>
						{showAllVersions ? 'Hide' : 'Read more...'}
					</Button>
				)}
			</p>
		</Card>
	);
};

function CustomTooltip({payload, active}: any) {
    
    if (!active || !payload) return null;
    return (
      <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
        {payload.map((category: any, idx: number) => (
          <div key={idx} className="flex flex-1 space-x-2.5">
            <div
              className={`flex w-1 flex-col bg-${category.color}-500 rounded`}
            />
            <div className="space-y-1">
              	<p className=" text-tremor-content-emphasis">{category.dataKey}: {category.value}</p>  
				<p className="font-small">
					Click for more details
				</p>
			
            </div>
          </div>
        ))}
      </div>
    );
  };
