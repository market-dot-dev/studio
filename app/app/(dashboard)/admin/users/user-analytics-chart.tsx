"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { User } from "@prisma/client";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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

  // Chart configuration for Shadcn
  const chartConfig = {
    "Total Users": {
      label: "Total Users",
      color: "hsl(var(--chart-2))"
    }
  } satisfies ChartConfig;

  // Custom value formatter for tooltips
  const valueFormatter = (value: number) => `${value.toLocaleString()} users`;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold">User Growth</h3>
        <p className="text-sm text-muted-foreground">
          {period === "all"
            ? "All time user growth"
            : `User growth in the last ${period === "30days" ? "30" : "60"} days`}
        </p>
      </div>

      <div className="mt-4">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 0
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  // Shorten date format for x-axis to save space
                  const parts = value.split(", ");
                  if (parts.length > 1) {
                    return `${parts[0]}, ${parts[1].slice(2)}`;
                  }
                  return value;
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toLocaleString()}
                allowDecimals={false}
                tickCount={5}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent formatter={(value) => valueFormatter(Number(value))} />
                }
              />
              <Line
                dataKey="Total Users"
                type="monotone"
                strokeWidth={2}
                stroke="hsl(var(--chart-2))"
                dot={false}
                connectNulls={true}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex h-72 items-center justify-center rounded-lg border bg-muted/50">
            <p className="text-muted-foreground">No user data available to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
