import PageHeader from "@/components/common/page-header";
import RepoService from "@/app/services/RepoService";
import RevenueReports from "./reports-tabs";
import { customers as getCustomersData } from "@/app/services/UserService";

export default async function ReportsPage() {

  const [reposResult, customers] = await Promise.all([
    RepoService.getRepos(),
    getCustomersData()
  ]);

	const repos = reposResult.map(repo => ({
		radarId: repo.radarId,
		name: repo.name
	}));
  
  return (
    <div className="flex max-w-screen-xl flex-col space-y-10">
          <PageHeader title="Reports" />
      <RevenueReports customers={customers} />
    </div>
  );
}