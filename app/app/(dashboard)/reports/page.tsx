
import PageHeading from "@/components/common/page-heading";
import RepoService from "@/app/services/RepoService";
import ReportsTabs from "./reports-tabs";
import { customers as getCustomersData } from "@/app/services/UserService";

export default async function ReportsPage({ params }: { params: { id: string } }) {
  
  const [reposResult, customers] = await Promise.all([
    RepoService.getRepos(),
    getCustomersData()
  ]);
	const repos = reposResult.map(repo => ({
		radarId: repo.radarId,
		name: repo.name
	}));
  
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex justify-between w-full">
        <div className="flex flex-col space-y-6 w-full">
          <PageHeading title="Reports" />
          <ReportsTabs repos={repos} customers={customers} />
        </div>
      </div>
    </div>
  );
}