'use client'
import Link from "next/link";
import { getDependentPackages, getDependentPackagesFacets, getPackages } from "@/app/services/LeadsService";
import { Repo } from "@prisma/client";
import { Badge, BarChart, Button, Card, Select, SelectItem, Tab, TabGroup, TabList, Text, Table,
	TableBody,
	TableCell,
	TableRow,
	TableHead,
	TableHeaderCell,
	Title,
   } from "@tremor/react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import LoadingSpinner from "../form/loading-spinner";
import demoData, { dummyFacetsData } from "./demo-data";
import { useSearchParams } from "next/navigation";

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
	const [tabIndex, setTabIndex] = useState<number>(0); // major_versions

	const [isPendingDependents, startDependentsTransition] = useTransition();
	const [isPendingPackages, startPackagesTransition] = useTransition();

	const searchParams = useSearchParams();
	const useDummyData = searchParams.get('dummydata');

	const chartData = useMemo(() => {
		if( useDummyData || !repos.length) {
			return demoData
		}
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

		return data;
	}, [allData, tabIndex, useDummyData]);
	
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
		
		// console.log('getting dependent package facets for', e)
		setSelectedPackage(e);

		startDependentsTransition(() => {
			getDependentPackagesFacets(parseInt(e)).then((res) => {
				setAlldata(res.data);
			});
		});
	}, [setAlldata, setSelectedPackage, selectedPackage]);

	const getVersionDependents = useCallback((e: any) => {
		if (compact || !e || !selectedPackage) return;
		// console.log('getting version dependents for', e)
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

	useEffect(() => {
		const el = document.querySelector(".myElement")
	// const observer = new IntersectionObserver( 
	// ([e]) => e.target.classList.toggle("is-pinned", e.intersectionRatio < 1),
	// { threshold: [1] }
	// );

	// observer.observe(el);
	}, [])

	const chartSection = (
		<>
		{ isPendingPackages ?
			<div className="flex w-full justify-center items-center"><LoadingSpinner /></div>
			: 
			<BarChart
				className="h-72 mt-4 mx-auto pt-0 w-full"
				// style={{ width: `max(100%, min(${chartData.length * 100}px, 100%))`}}
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
			{ !repos.length ?
				<Text>This is demo data. <Link href="/settings/repos" className="underline">Connect a repository</Link> to see real usage data for your repos & packages.</Text>
				: null
			}
			<div className="grid gap-6 grid-cols-3 relative z-20">
				<div className="flex gap-2 items-center">
					<label>Repo</label>
					<Select
						defaultValue={`${repos[0]?.radarId ?? ''}`}
						onValueChange={getPackagesForRadarId}
						disabled={! repos?.length}
					>
						{ repos.length ? repos.map((repo: RepoItem) => (
							<SelectItem key={repo.radarId} value={`${repo.radarId}`}>{repo.name}</SelectItem>
							))
							: <SelectItem value="0">Select a Repo</SelectItem>
						}
					</Select>
				</div>
				
				
				<div className="flex gap-2 items-center">
					<label>Package</label>
					<Select
						value={selectedPackage ?? (packages.length ? packages[0].id : '')}
						onValueChange={getDependentsForPackageId}
						disabled={! packages?.length}
					>
						{packages.length ? packages.map(pkg => (
							<SelectItem key={pkg.id} value={`${pkg.id}`}>{pkg.name}</SelectItem>
						)) 
						: <SelectItem value="0">Select a Package</SelectItem>
					}
					</Select>
				</div>
				<div className="grow">
					
					<TabGroup
						className="ml-auto flex justify-end"
						defaultIndex={tabIndex}
						onIndexChange={(index: number) => {
							
							if( ! allData ) return;

							setDependentPackages([]);
							setTabIndex(index);
						}}
					>
						<TabList variant="solid">
							{Object.keys(allData ?? dummyFacetsData).map((key: string, index: number) => (
								<Tab value={key} key={index} className={tabIndex === index ? "bg-white" : ""} >{versionLabels[key]}</Tab>
							))}
						</TabList>
					</TabGroup>
						
				</div>
			</div>

			{/* on home page, dont use card */}
			{ compact ? chartSection :
				<Card className="bg-white z-10 min-h-12 w-full">
					{chartSection}
				</Card>
			}
			{ chartData.length ?
				<div className="flex flex-col items-center gap-4 mt-6 w-full">
					{isPendingDependents &&
						<div className="mx-auto"><LoadingSpinner /></div>
					}
					{ dependentPackages.length ?
						<>
							<Title className="mr-auto">Dependent Packages</Title>
							<Table className="w-full">
								<TableHead>
									<TableRow>
									<TableHeaderCell>
										Name
									</TableHeaderCell>
									<TableHeaderCell>
										Description
									</TableHeaderCell>
									<TableHeaderCell>
										Latest Release
									</TableHeaderCell>
									<TableHeaderCell>
										Downloads
									</TableHeaderCell>
									<TableHeaderCell>
										Resolved Versions
									</TableHeaderCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{dependentPackages.map((data) => (
										<PackageRow key={data.id} data={data} />
									))}
								</TableBody>
							</Table>
						</>
						: null
					}
				</div>
				: null
			}
		</div>
	)
}

function PackageRow({ data }: { data: any }) {
	
	const versions = Object.keys(data.versions) || [];
	
	return (
		
		<TableRow key={data.id} className="text-gray-700">
			<TableCell>
				<p>{data.name}</p>
			</TableCell>
			<TableCell>
				<p className="text-wrap">{data.package_fields.description ?? ''}</p>
			</TableCell>
			<TableCell>
				<p>
					{data.package_fields.latest_release_number ?? ''} ({new Date(data.package_fields.latest_release_published_at).toLocaleDateString()})
				</p>
			</TableCell>
			
			<TableCell>
				<p>{data.package_fields.downloads ?? 0}</p>
			</TableCell>
			<TableCell>
				<p>{versions.length > 0 ? versions[0] : "N/A"}</p>
			</TableCell>
		</TableRow>
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
