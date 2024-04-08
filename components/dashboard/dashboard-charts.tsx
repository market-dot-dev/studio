"use client";

// import { random } from "@/lib/utils";
import { Metric, Card, Text, AreaChart, BadgeDelta, Flex, BarChart, LineChart, Button, Badge } from "@tremor/react";
import { useCallback, useEffect, useMemo, useState } from "react";
// import DashboardCard from "../common/dashboard-card";
// import Link from "next/link";
import { getSubscriptionsCreated } from "@/app/services/ReportingService";
import LoadingSpinner from "../form/loading-spinner";


export default function DashboardCharts() {
  
  const [customerTotals, setCustomerTotals] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true);

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
    setLoading(true);
    getSubscriptionsCreated().then((subscriptions) => {
      processNewCustomers(subscriptions);
      processRevenueData(subscriptions);
    }).catch((e) => {
      console.log('Error fetching data', e.message);

    }).finally(() => {
      setLoading(false);
    });
  }, [])

  const totalNewSubscriptions = useMemo(() => {
    return customerTotals.reduce((acc, cur) => acc + cur['New Subscriptions'], 0);
  }, [customerTotals]);

  const totalRevenue = useMemo(() => {
    return revenueData.reduce((acc, cur) => acc + cur['New Subscriptions'], 0); 
  }, [revenueData]);


  return (
    <>
      <div className="flex max-w-screen-xl flex-col mt-4 space-y-4">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <div className="flex flex-row justify-between">
              <Text>Customers</Text>
              {/* <Badge className="z-100">Example Data Shown</Badge> */}
            </div>
            <Flex
              className="space-x-3 truncate"
              justifyContent="start"
              alignItems="baseline"
            >
              <Metric className="font-cal">{totalNewSubscriptions}</Metric>
              {/* <BadgeDelta
                deltaType="moderateIncrease"
                className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
              >
                34.3%
              </BadgeDelta> */}
            </Flex>
            { loading ? 
              <div className="h-72 mt-4 w-full flex justify-center items-center">
                <LoadingSpinner />
              </div> 
              : 
              <BarChart
                className="h-72 mt-4"
                data={customerTotals}
                index="date"
                categories={["New Subscriptions", 
                  // "Renewals"
                ]}
                colors={["gray-400", 
                  // "gray-200"
                ]}
                yAxisWidth={30}
              />
            }
          </Card>

          <Card>
            <div className="flex flex-row justify-between">
              <Text>Revenue</Text>
              {/* <Badge className="z-100">Example Data Shown</Badge> */}
            </div>
            <Flex
              className="space-x-3 truncate"
              justifyContent="start"
              alignItems="baseline"
            >
              <Metric className="font-cal">${totalRevenue}</Metric>
              {/* <BadgeDelta
                deltaType="moderateIncrease"
                className="dark:bg-green-900 dark:bg-opacity-50 dark:text-green-400"
              >
                34.3%
              </BadgeDelta> */}
            </Flex>
            { loading ? 
              <div className="h-72 mt-4 w-full flex justify-center items-center">
                <LoadingSpinner />
              </div> 
              :           
              <LineChart
                className="h-72 mt-4"
                data={revenueData}
                index="date"
                categories={["New Subscriptions",
                //  "Renewals"
                ]}
                colors={["gray-500", 
                // "gray-300"
                ]}
                yAxisWidth={30}
                connectNulls={true}
              />
              }
          </Card>
        </div>

        {/* <div className="grid justify-items-end mt-4">
          <Link href='/reports'>
            <Button size="xs" className="h-6" variant="secondary">
              All Reports →
            </Button>
          </Link>
        </div> */}
      </div>
    </>
  );
}
