import DashboardCharts from "@/components/dashboard/dashboard-charts";
import OnboardingGuide from "@/components/onboarding/onboarding-guide";
import PageHeading from "@/components/common/page-heading";
import SessionService from "@/app/services/SessionService";
import RepoService from "@/app/services/RepoService";
import { customers as getCustomersData } from "@/app/services/UserService";
import { redirect } from "next/navigation";
import SalesTable from "./customers/sales-table";
import SiteAdmin from "@/components/site/site-admin"; // Update the import path
import SiteService from "@/app/services/SiteService"; // Update this import

export default async function Overview() {

  const user = await SessionService.getSessionUser();
  if( !user?.id ) {
    redirect("/login");
  }
  
  const [repoResults, customers] = await Promise.all([
    RepoService.getRepos(),
    getCustomersData()
  ]);

  const title = user?.name ? `Welcome, ${user.name}!` : "Your Dashboard";
  const onboarding = user?.onboarding;

  const repos = repoResults.map(repo => ({
    radarId: repo.radarId,
    name: repo.name
  }));

  const site = await SiteService.getCurrentSite();

  return (
    <>
      <div className="flex max-w-screen-xl flex-col">
        <div className="text-center">
          {onboarding ? <OnboardingGuide dashboard={true} /> : null}
        </div>
        <div className="flex flex-col space-y-6">
          <PageHeading title={title} />
          <div className="flex flex-col gap-8">
            {/* <h3 className="text-xl font-bold">Repo & Package Analytics</h3>
            <DependentPackagesWidget repos={repos} /> */}

            {site && <SiteAdmin id={site.id} isDashboard={true} />} {/* Add isDashboard prop */}

            <h3 className="text-xl font-bold">Latest Sales</h3>
            <SalesTable customers={customers} maxInitialRows={5} />
            <h3 className="text-xl font-bold">Reports</h3>
            <DashboardCharts customers={customers} />
          </div>
        </div>
      </div>
    </>
  );
}
