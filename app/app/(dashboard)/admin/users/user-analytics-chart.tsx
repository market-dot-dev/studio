"use client";

import { User } from "@prisma/client";
import { LineChart } from "@tremor/react";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface UserAnalyticsChartProps {
  users: User[];
}

export default function UserAnalyticsChart({ users }: UserAnalyticsChartProps) {
  const searchParams = useSearchParams();
  const period = searchParams.get("period") || "30days";

  const chartData = useMemo(() => {
    if (!users || users.length === 0) {
      return [];
    }

    console.log(`Processing ${users.length} users for chart`);

    // Just count users per date
    const usersByDate: Record<string, number> = {};
    let total = 0;

    // Sort users by creation date
    const sortedUsers = [...users]
      .filter((user) => user.createdAt) // Skip users without dates
      .sort((a, b) => {
        const dateA = new Date(a.createdAt!).getTime();
        const dateB = new Date(b.createdAt!).getTime();
        return dateA - dateB;
      });

    console.log(`${sortedUsers.length} users with valid creation dates`);

    // Create a data point for each date where a user was created
    sortedUsers.forEach((user) => {
      if (!user.createdAt) return;

      try {
        const date = new Date(user.createdAt);
        const dateKey = format(date, "MMM d, yyyy");

        total++;
        usersByDate[dateKey] = total;
      } catch (error) {
        console.error("Error processing user date", error);
      }
    });

    // Convert to array for chart
    const result = Object.entries(usersByDate).map(([date, count]) => ({
      date,
      "Total Users": count
    }));

    console.log(`Created ${result.length} data points for chart`);
    return result;
  }, [users]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold">User Growth</h3>
        <p className="text-sm text-gray-500">
          {period === "all"
            ? "All time user growth"
            : `User growth in the last ${period === "30days" ? "30" : "60"} days`}
        </p>
      </div>

      {chartData.length > 0 ? (
        <LineChart
          className="mt-4 h-72"
          data={chartData}
          index="date"
          categories={["Total Users"]}
          colors={["blue"]}
          valueFormatter={(value) => `${value.toLocaleString()} users`}
          showLegend={false}
          showXAxis={true}
          showYAxis={true}
          showGridLines={true}
        />
      ) : (
        <div className="flex h-72 items-center justify-center rounded-lg border bg-gray-50">
          <p className="text-gray-500">No user data available to display</p>
        </div>
      )}
    </div>
  );
}
