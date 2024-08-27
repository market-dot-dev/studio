"use client";

import { LineChart } from "@tremor/react";

interface RevenueLineChartProps {
  revenueData: any[];
  isUsingDummyData: boolean;
  highestRevenueItemInMonth: number;
}

const valueFormatter = (number: number) => `$${Intl.NumberFormat('us').format(number)}`;

export default function RevenueLineChart({
  revenueData,
  isUsingDummyData,
  highestRevenueItemInMonth,
}: RevenueLineChartProps) {
  return (
    <LineChart
      className="h-72 mt-4"
      data={revenueData}
      index="date"
      categories={["New Subscriptions", "Renewals", "One-time Charges"]}
      colors={isUsingDummyData
        ? ["gray-300", "gray-500", "gray-700"]
        : ["gray-500", "blue-300", "yellow-300"]}
      connectNulls={true}
      valueFormatter={valueFormatter}
      autoMinValue={true}
      maxValue={Math.ceil(highestRevenueItemInMonth * 120 / 100)}
      intervalType="preserveStartEnd"
      allowDecimals={false}
    />
  );
}