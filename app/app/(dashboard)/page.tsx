import DashboardCharts from "@/components/dashboard/dashboard-charts";
import PageHeading from "@/components/common/page-heading";
import SessionService from "@/app/services/SessionService";
import RepoService from "@/app/services/RepoService";
// import DependentPackagesWidget from "@/components/packages/dependent-packages-widget";

import { customers as getCustomersData } from "@/app/services/UserService";
import { redirect } from "next/navigation";
import SalesTable from "./customers/sales-table";

export default async function Overview() {

  const user = await SessionService.getSessionUser();

  if( !user?.id ) {
    redirect("/login");
  }

  const [repoResults, customers] = await Promise.all([
    RepoService.getRepos(),
    getCustomersData()
  ]);

  const title = user?.name ? `Welcome, ${user.name}` : "Your Dashboard";

  const repos = repoResults.map(repo => ({
    radarId: repo.radarId,
    name: repo.name
  }));

  return (
    <div className="flex max-w-screen-xl flex-col space-y-6">
      <PageHeading title={title} />
      <div className="flex flex-col">
        <SalesTable customers={customers} maxInitialRows={5} />
        <DashboardCharts customers={customers} />
      </div>
    </div>
  );
}
