"use client";

import { random } from "@/lib/utils";
import { Metric, Text, AreaChart, BadgeDelta, Flex, BarChart } from "@tremor/react";
import { useMemo } from "react";
import DashboardCard from "./common/dashboard-card";

export default function OverviewStats() {
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


  const chartdata4 = [
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
    {
      date: "Jul 23",
      "New Subscriptions": 167,
      "Cancellations": 145,
      "Renewals": 135,
    },
    {
      date: "Aug 23",
      "New Subscriptions": 125,
      "Cancellations": 110,
      "Renewals": 155,
    },
    {
      date: "Sep 23",
      "New Subscriptions": 156,
      "Cancellations": 149,
      "Renewals": 145,
    },
    {
      date: "Oct 23",
      "New Subscriptions": 165,
      "Cancellations": 112,
      "Renewals": 125,
    },
    {
      date: "Nov 23",
      "New Subscriptions": 153,
      "Cancellations": 138,
      "Renewals": 165,
    },
    {
      date: "Dec 23",
      "New Subscriptions": 124,
      "Cancellations": 145,
      "Renewals": 175,
    },
  ];


  return (
    <>
      <div className="grid gap-6 sm:grid-cols-1">
        <DashboardCard>
        <Text>Total Monthly Revenue</Text>
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

          <BarChart
            className="h-72 mt-4"
            data={chartdata4}
            index="date"
            categories={["New Subscriptions", "Renewals"]}
            stack={true}
            yAxisWidth={30}
          />
        </DashboardCard>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <DashboardCard>
          <Text>Visitors Across Channels</Text>
          <Flex
            className="space-x-3 truncate"
            justifyContent="start"
            alignItems="baseline"
          >
            <Metric className="font-cal">170,418</Metric>
            <BadgeDelta
              deltaType="moderateIncrease"
              className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
            >
              34.3%
            </BadgeDelta>
          </Flex>
          <AreaChart
            className="mt-6 h-28"
            data={data}
            index="Month"
            valueFormatter={(number: number) =>
              `${Intl.NumberFormat("us").format(number).toString()}`
            }
            categories={["Total Visitors"]}
            colors={["blue"]}
            showXAxis={true}
            showGridLines={false}
            startEndOnly={true}
            showYAxis={false}
            showLegend={false}
          />
        </DashboardCard>

        <DashboardCard>
          <Text>Website Visitors</Text>
          <Flex
            className="space-x-3 truncate"
            justifyContent="start"
            alignItems="baseline"
          >
            <Metric className="font-cal">170,418</Metric>
            <BadgeDelta
              deltaType="moderateIncrease"
              className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
            >
              34.3%
            </BadgeDelta>
          </Flex>
          <AreaChart
            className="mt-6 h-28"
            data={data}
            index="Month"
            valueFormatter={(number: number) =>
              `${Intl.NumberFormat("us").format(number).toString()}`
            }
            categories={["Total Visitors"]}
            colors={["blue"]}
            showXAxis={true}
            showGridLines={false}
            startEndOnly={true}
            showYAxis={false}
            showLegend={false}
          />
        </DashboardCard>


        <DashboardCard>
          <Text>New Subscriptions</Text>
          <Flex
            className="space-x-3 truncate"
            justifyContent="start"
            alignItems="baseline"
          >
            <Metric className="font-cal">170,418</Metric>
            <BadgeDelta
              deltaType="moderateIncrease"
              className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
            >
              40%
            </BadgeDelta>
          </Flex>
          <BarChart
            className="mt-6 h-28"
            data={data}
            index="Month"
            valueFormatter={(number: number) =>
              `${Intl.NumberFormat("us").format(number).toString()}`
            }
            categories={["Total Visitors"]}
            colors={["blue"]}
            showXAxis={true}
            showGridLines={false}
            startEndOnly={true}
            showYAxis={false}
            showLegend={false}
          />
        </DashboardCard>

        <DashboardCard>
          <Text>Total Revenue</Text>
          <Flex
            className="space-x-3 truncate"
            justifyContent="start"
            alignItems="baseline"
          >
            <Metric className="font-cal">170,418</Metric>
            <BadgeDelta
              deltaType="moderateIncrease"
              className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
            >
              10%
            </BadgeDelta>
          </Flex>
          <AreaChart
            className="mt-6 h-28"
            data={data}
            index="Month"
            valueFormatter={(number: number) =>
              `${Intl.NumberFormat("us").format(number).toString()}`
            }
            categories={["Total Visitors"]}
            colors={["blue"]}
            showXAxis={true}
            showGridLines={false}
            startEndOnly={true}
            showYAxis={false}
            showLegend={false}
          />
        </DashboardCard>


        <DashboardCard>
          <Text>Monthly Churn</Text>
          <Flex
            className="space-x-3 truncate"
            justifyContent="start"
            alignItems="baseline"
          >
            <Metric className="font-cal">10%</Metric>
            <BadgeDelta
              deltaType="moderateIncrease"
              isIncreasePositive={false}
            >
              2%
            </BadgeDelta>
          </Flex>
          <AreaChart
            className="mt-6 h-28"
            data={data}
            index="Month"
            valueFormatter={(number: number) =>
              `${Intl.NumberFormat("us").format(number).toString()}`
            }
            categories={["Total Visitors"]}
            colors={["blue"]}
            showXAxis={true}
            showGridLines={false}
            startEndOnly={true}
            showYAxis={false}
            showLegend={false}
          />
        </DashboardCard>


        <DashboardCard>
          <Text>Renewals</Text>
          <Flex
            className="space-x-3 truncate"
            justifyContent="start"
            alignItems="baseline"
          >
            <Metric className="font-cal">170,418</Metric>
            <BadgeDelta
              deltaType="moderateIncrease"
              className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
            >
              40%
            </BadgeDelta>
          </Flex>
          <BarChart
            className="mt-6 h-28"
            data={data}
            index="Month"
            valueFormatter={(number: number) =>
              `${Intl.NumberFormat("us").format(number).toString()}`
            }
            categories={["Total Visitors"]}
            colors={["blue"]}
            showXAxis={true}
            showGridLines={false}
            startEndOnly={true}
            showYAxis={false}
            showLegend={false}
          />
        </DashboardCard>

      </div>
    </>
  );
}
