import RepoService from "@/app/services/RepoService";
import { customers as getCustomersData } from "@/app/services/UserService";
import PageHeader from "@/components/common/page-header";
import RevenueReports from "./reports-tabs";

export default async function ReportsPage() {
  const [reposResult, customers] = await Promise.all([RepoService.getRepos(), getCustomersData()]);

  const repos = reposResult.map((repo) => ({
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
