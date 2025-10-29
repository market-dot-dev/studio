"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface CustomerBarChartProps {
  customerTotals: any[];
  highestCustChangesInAMonth: number;
}

export function CustomerBarChart({
  customerTotals,
  highestCustChangesInAMonth
}: CustomerBarChartProps) {
  const chartConfig = {
    "New Subscriptions": {
      label: "New Subscriptions",
      color: "hsl(var(--chart-1))"
    },
    Cancellations: {
      label: "Cancellations",
      color: "hsl(var(--chart-2))"
    },
    Renewals: {
      label: "Renewals",
      color: "hsl(var(--chart-3))"
    },
    "One-time Charges": {
      label: "One-time Charges",
      color: "hsl(var(--chart-4))"
    }
  } satisfies ChartConfig;

  return (
    <div className="mt-3">
      <ChartContainer config={chartConfig} className="min-h-72 max-w-full">
        <BarChart
          accessibilityLayer
          data={customerTotals}
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
            tickCount={customerTotals.length}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            allowDecimals={false}
            tick={{ transform: "translate(-3, 0)" }}
            tickCount={5}
            domain={[0, Math.ceil((highestCustChangesInAMonth * 120) / 100)]}
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
          <Bar
            dataKey="New Subscriptions"
            fill={chartConfig["New Subscriptions"].color}
            radius={4}
          />
          <Bar dataKey="Cancellations" fill={chartConfig["Cancellations"].color} radius={4} />
          <Bar dataKey="Renewals" fill={chartConfig["Renewals"].color} radius={4} />
          <Bar dataKey="One-time Charges" fill={chartConfig["One-time Charges"].color} radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
