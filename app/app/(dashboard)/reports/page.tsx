import AllCharts from "@/components/overview-stats";
import PageHeading from "@/components/common/page-heading";
import { Text, Badge } from "@tremor/react";

export default function ReportsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <PageHeading title="Reports" />
          <Text>Your revenue & customer reports.</Text>
          <Badge>Coming Soon</Badge>
        </div>
      </div>
      <AllCharts />
    </div>
  );
}