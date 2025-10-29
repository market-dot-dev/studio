"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface RevenueLineChartProps {
  revenueData: any[];
  highestRevenueItemInMonth: number;
}

const valueFormatter = (number: number) => `$${Intl.NumberFormat("us").format(number)}`;

export function RevenueLineChart({
  revenueData,
  highestRevenueItemInMonth
}: RevenueLineChartProps) {
  const chartConfig = {
    "New Subscriptions": {
      label: "New Subscriptions",
      color: "hsl(var(--chart-1))"
    },
    Renewals: {
      label: "Renewals",
      color: "hsl(var(--chart-2))"
    },
    "One-time Charges": {
      label: "One-time Charges",
      color: "hsl(var(--chart-3))"
    }
  } satisfies ChartConfig;

  return (
    <div className="mt-3">
      <ChartContainer config={chartConfig} className="min-h-72 max-w-full">
        <LineChart
          accessibilityLayer
          data={revenueData}
          margin={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickCount={revenueData.length}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={valueFormatter}
            allowDecimals={false}
            tick={{ transform: "translate(-3, 0)" }}
            tickCount={5}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend
            content={(props: any) => (
              <ChartLegendContent
                payload={props.payload}
                verticalAlign="top"
                className="justify-end"
              />
            )}
            verticalAlign="top"
          />
          <Line
            dataKey="New Subscriptions"
            type="linear"
            strokeWidth={2}
            stroke="hsl(var(--chart-1))"
            dot={false}
            connectNulls={true}
          />
          <Line
            dataKey="Renewals"
            type="linear"
            strokeWidth={2}
            stroke="hsl(var(--chart-2))"
            dot={false}
            connectNulls={true}
          />
          <Line
            dataKey="One-time Charges"
            type="linear"
            strokeWidth={2}
            stroke="hsl(var(--chart-3))"
            dot={false}
            connectNulls={true}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
