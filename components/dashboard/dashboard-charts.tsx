"use client";

import { random } from "@/lib/utils";
import { Metric, Card, Text, AreaChart, BadgeDelta, Flex, BarChart, LineChart, Button, Badge } from "@tremor/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardCard from "../common/dashboard-card";
import Link from "next/link";
import { getSubscriptionsCreated } from "@/app/services/ReportingService";

export default function DashboardCharts() {
  // const data = useMemo(() => {
  //   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  //   return [
  //     ...months.map((month) => ({
  //       Month: `${month} 23`,
  //       "Total Visitors": random(20000, 170418),
  //     })),
  //     {
  //       Month: "Jul 23",
  //       "Total Visitors": 170418,
  //     },
  //   ];
  // }, []);

  // const revenueData = [
  //   {
  //     date: "Jan 23",
  //     "New Subscriptions": 450,
  //     "Renewals": 780,
  //   },
  //   {
  //     date: "Feb 23",
  //     "New Subscriptions": 1050,
  //     "Renewals": 900,
  //   },
  //   {
  //     date: "Mar 23",
  //     "New Subscriptions": 1400,
  //     "Renewals": 1000,
  //   },
  //   {
  //     date: "Apr 23",
  //     "New Subscriptions": 1800,
  //     "Renewals": 1050,
  //   },
  //   {
  //     date: "May 23",
  //     "New Subscriptions": 1600,
  //     "Renewals": 1500,
  //   },
  //   {
  //     date: "Jun 23",
  //     "New Subscriptions": 1700,
  //     "Renewals": 2250,
  //   }
  // ];

  // const customerTotals = [
  //   {
  //     date: "Jan 23",
  //     "New Subscriptions": 167,
  //     "Cancellations": 145,
  //     "Renewals": 135,
  //   },
  //   {
  //     date: "Feb 23",
  //     "New Subscriptions": 125,
  //     "Cancellations": 110,
  //     "Renewals": 155,
  //   },
  //   {
  //     date: "Mar 23",
  //     "New Subscriptions": 156,
  //     "Cancellations": 149,
  //     "Renewals": 145,
  //   },
  //   {
  //     date: "Apr 23",
  //     "New Subscriptions": 165,
  //     "Cancellations": 112,
  //     "Renewals": 125,
  //   },
  //   {
  //     date: "May 23",
  //     "New Subscriptions": 153,
  //     "Cancellations": 138,
  //     "Renewals": 165,
  //   },
  //   {
  //     date: "Jun 23",
  //     "New Subscriptions": 124,
  //     "Cancellations": 145,
  //     "Renewals": 175,
  //   },
  // ];

  const [customerTotals, setCustomerTotals] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])

  const processNewCustomers = useCallback((subscriptions: any[]) => {
    const subscriptionCounts = {} as any;

      // Fill the subscriptionCounts with months
      for (let i = 0; i < 12; i++) {
        subscriptionCounts[i] = {
          date: new Date(0, i).toLocaleString('default', { month: 'short' }) + ' 23',
          'New Subscriptions': 0,
          'Cancellations': 0, 
          'Renewals': 0, 
        };
      }

      // Count the subscriptions for each month
      subscriptions.forEach(subscription => {
        const month = subscription.createdAt.getMonth();
        subscriptionCounts[month]['New Subscriptions']++;
      });

      const processedData = Object.values(subscriptionCounts)
      
      setCustomerTotals(processedData);
  }, [])

  const processRevenueData = useCallback((subscriptions: any[]) => {
    
    const yearStart = new Date(new Date().getFullYear(), 0, 1);

    const revenueData = Array.from({ length: 12 }, (_, i) => ({
      date: new Date(yearStart.getFullYear(), i).toLocaleString('default', { month: 'short' }) + ' 23',
      'New Subscriptions': 0,
      'Renewals': 0,
    }));

    subscriptions.forEach(subscription => {
      const monthIndex = subscription.createdAt.getMonth();
      const price = subscription.tier.price; 

      revenueData[monthIndex]['New Subscriptions'] += price;
    });

    setRevenueData(revenueData);
  }, []);

  useEffect(() => {
    getSubscriptionsCreated().then((subscriptions) => {
      processNewCustomers(subscriptions);
      processRevenueData(subscriptions);
      
    });
  }, [])


  return (
    <>
      <div className="flex max-w-screen-xl flex-col mt-4 space-y-4">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <div className="flex flex-row justify-between">
              <Text>Customers</Text>
              <Badge className="z-100">Example Data Shown</Badge>
            </div>
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
              colors={["gray-400", "gray-200"]}
              yAxisWidth={30}
            />
          </Card>

          <Card>
            <div className="flex flex-row justify-between">
              <Text>Monthly Revenue</Text>
              <Badge className="z-100">Example Data Shown</Badge>
            </div>
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
              colors={["gray-500", "gray-300"]}
              yAxisWidth={30}
              connectNulls={true}
            />
          </Card>
        </div>

        <div className="grid justify-items-end mt-4">
          <Link href='/reports'>
            <Button size="xs" className="h-6" variant="secondary">
              All Reports →
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
