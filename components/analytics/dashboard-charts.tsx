"use client";

import { random } from "@/lib/utils";
import { Metric, Text, AreaChart, BadgeDelta, Flex, BarChart, LineChart, Button } from "@tremor/react";
import { useMemo } from "react";
import DashboardCard from "../common/dashboard-card";

export default function DashboardCharts() {
  const data = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return [
      ...months.map((month) => ({
        Month: `${month} 23`,
        "Total Visitors": random(20000, 170418),
      })),
      {
        Month: "Jul 23",
        "Total Visitors": 170418,
      },
    ];
  }, []);

  const revenueData = [
    {
      date: "Jan 23",
      "New Subscriptions": 450,
      "Renewals": 780,
    },
    {
      date: "Feb 23",
      "New Subscriptions": 1050,
      "Renewals": 900,
    },
    {
      date: "Mar 23",
      "New Subscriptions": 1400,
      "Renewals": 1000,
    },
    {
      date: "Apr 23",
      "New Subscriptions": 1800,
      "Renewals": 1050,
    },
    {
      date: "May 23",
      "New Subscriptions": 1600,
      "Renewals": 1500,
    },
    {
      date: "Jun 23",
      "New Subscriptions": 1700,
      "Renewals": 2250,
    }
  ];


  const customerTotals = [
    {
      date: "Jan 23",
      "New Subscriptions": 167,
      "Cancellations": 145,
      "Renewals": 135,
    },
    {
      date: "Feb 23",
      "New Subscriptions": 125,
      "Cancellations": 110,
      "Renewals": 155,
    },
    {
      date: "Mar 23",
      "New Subscriptions": 156,
      "Cancellations": 149,
      "Renewals": 145,
    },
    {
      date: "Apr 23",
      "New Subscriptions": 165,
      "Cancellations": 112,
      "Renewals": 125,
    },
    {
      date: "May 23",
      "New Subscriptions": 153,
      "Cancellations": 138,
      "Renewals": 165,
    },
    {
      date: "Jun 23",
      "New Subscriptions": 124,
      "Cancellations": 145,
      "Renewals": 175,
    },
  ];


  return (
    <>
      <div className="flex max-w-screen-xl flex-col mt-4 space-y-4 px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <DashboardCard>
            <Text>Customers</Text>
            <Flex
              className="space-x-3 truncate"
              justifyContent="start"
              alignItems="baseline"
            >
              <Metric className="font-cal">23</Metric>
              <BadgeDelta
                deltaType="moderateIncrease"
                className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
              >
                34.3%
              </BadgeDelta>
            </Flex>

            <BarChart
              className="h-72 mt-4"
              data={customerTotals}
              index="date"
              categories={["New Subscriptions", "Renewals"]}
              stack={true}
              yAxisWidth={30}
            />
          </DashboardCard>

          <DashboardCard>
            <Text>Monthly Revenue</Text>
            <Flex
              className="space-x-3 truncate"
              justifyContent="start"
              alignItems="baseline"
            >
              <Metric className="font-cal">$4,500</Metric>
              <BadgeDelta
                deltaType="moderateIncrease"
                className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
              >
                34.3%
              </BadgeDelta>
            </Flex>

            <LineChart
              className="h-72 mt-4"
              data={revenueData}
              index="date"
              categories={["New Subscriptions", "Renewals"]}
              colors={["neutral", "indigo"]}
              yAxisWidth={30}
              connectNulls={true}
            />
          </DashboardCard>
        </div>

        <div className="grid justify-items-end">
          <Button size="xs" className="h-6" variant="secondary">
            All Reports →
          </Button>
        </div>
      </div>
    </>
  );
}
