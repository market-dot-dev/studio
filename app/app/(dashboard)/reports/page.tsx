import OverviewStats from "@/components/overview-stats";

export default function AnalyticsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-cal text-3xl font-bold dark:text-white">
            Analytics
          </h1>
        </div>

        <div className="flex flex-col space-y-2">
          <h2>Site and customer analytics</h2>
        </div>

        <div className="flex flex-col space-y-6">
          <OverviewStats />
        </div>


      </div>
    </div>
  );
}