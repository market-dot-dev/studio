"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface LineChartCardProps {
  title: string;
  subtitle?: string;
  data: any[];
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

// Fallback to chart variables if needed
const defaultColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))"
];

const defaultValueFormatter = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

export function LineChartCard({
  title,
  subtitle = "Last 6 months",
  data,
  categories,
  colors = defaultColors,
  valueFormatter = defaultValueFormatter,
  className
}: LineChartCardProps) {
  // Create chart config for shadcn chart
  const chartConfig: ChartConfig = {};
  categories.forEach((category, index) => {
    chartConfig[category] = {
      label: category,
      color: colors[index % colors.length]
    };
  });

  return (
    <Card className={className}>
      <CardHeader className="pb-5">
        <CardTitle>
          <span className="mr-2">{title}</span>
          {subtitle && <span className="text-sm font-normal text-stone-500">{subtitle}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-72 max-w-full">
          <LineChart
            accessibilityLayer
            data={data}
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
              tickCount={data.length}
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
            {categories.length > 0 && (
              <ChartLegend
                content={<ChartLegendContent className="justify-end" />}
                verticalAlign="top"
              />
            )}

            {categories.map((category, index) => (
              <Line
                key={category}
                dataKey={category}
                type="linear"
                strokeWidth={2}
                stroke={chartConfig[category].color}
                dot={false}
                connectNulls={true}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
