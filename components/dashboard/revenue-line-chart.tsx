"use client";

import { LineChart } from "@tremor/react";

interface RevenueLineChartProps {
  revenueData: any[];
  isUsingDummyData: boolean;
  highestRevenueItemInMonth: number;
}

const valueFormatter = (number: number) => `$${Intl.NumberFormat("us").format(number)}`;

export default function RevenueLineChart({
  revenueData,
  isUsingDummyData,
  highestRevenueItemInMonth
}: RevenueLineChartProps) {
  return (
    <LineChart
      className="mt-3 h-72"
      data={revenueData}
      index="date"
      categories={["New Subscriptions", "Renewals", "One-time Charges"]}
      colors={
        isUsingDummyData
          ? ["stone-400", "stone-400", "stone-400"]
          : ["stone-500", "swamp", "orange-300"]
      }
      connectNulls={true}
      valueFormatter={valueFormatter}
      autoMinValue={true}
      maxValue={Math.ceil((highestRevenueItemInMonth * 120) / 100)}
      intervalType="preserveStartEnd"
      allowDecimals={false}
    />
  );
}
