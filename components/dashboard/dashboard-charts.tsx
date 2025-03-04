import { Metric, Flex, BarChart, Badge } from "@tremor/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CustomerWithChargesAndSubscriptions } from "@/app/app/(dashboard)/customers/customer-table";
import Link from "next/link";
import RevenueLineChart from "./revenue-line-chart";
import SecondaryButton from "@/components/common/secondary-button";

export default function DashboardCharts({ customers }: { customers: CustomerWithChargesAndSubscriptions[] }) {

  const getLastSixMonths = () => {
    const today = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(d);
    }
    return months;
  };

  const getRenewalMonth = (createdAt: Date, cadence: string) => {
    const creationDate = new Date(createdAt);
    let renewalDate;

    if (cadence === 'month') {
      renewalDate = new Date(creationDate.setMonth(creationDate.getMonth() + 1));
    } else if (cadence === 'year') {
      renewalDate = new Date(creationDate.setFullYear(creationDate.getFullYear() + 1));
    }

    return renewalDate;
  };

  const processCustomers = (customers: CustomerWithChargesAndSubscriptions[]) => {
    const lastSixMonths = getLastSixMonths();
    const subscriptionCounts = {} as any;

    lastSixMonths.forEach(date => {
      subscriptionCounts[date.getTime()] = {
        date: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        'New Subscriptions': 0,
        'Cancellations': 0,
        'Renewals': 0,
        'One-time Charges': 0,
      };
    });

    customers.forEach(customer => {
      customer.subscriptions.forEach(subscription => {
        const createdDate = new Date(subscription.createdAt);
        const monthKey = lastSixMonths.find(date =>
          date.getMonth() === createdDate.getMonth() &&
          date.getFullYear() === createdDate.getFullYear()
        );

        if (monthKey) {
          subscriptionCounts[monthKey.getTime()]['New Subscriptions']++;
        }

        if (subscription.cancelledAt) {
          const cancelledDate = new Date(subscription.cancelledAt);
          const cancelMonthKey = lastSixMonths.find(date =>
            date.getMonth() === cancelledDate.getMonth() &&
            date.getFullYear() === cancelledDate.getFullYear()
          );

          if (cancelMonthKey) {
            subscriptionCounts[cancelMonthKey.getTime()]['Cancellations']++;
          }
        }

        if (!subscription.cancelledAt) {
          let renewalDate = getRenewalMonth(subscription.createdAt, subscription.tier.cadence);

          while (renewalDate && renewalDate <= new Date()) {
            const renewalMonthKey = lastSixMonths.find(date =>
              date.getMonth() === renewalDate!.getMonth() &&
              date.getFullYear() === renewalDate!.getFullYear()
            );

            if (renewalMonthKey) {
              subscriptionCounts[renewalMonthKey.getTime()]['Renewals']++;
            }
            renewalDate = getRenewalMonth(renewalDate, subscription.tier.cadence);
          }
        }
      });

      customer.charges.forEach(charge => {
        const chargeDate = new Date(charge.createdAt);
        const monthKey = lastSixMonths.find(date =>
          date.getMonth() === chargeDate.getMonth() &&
          date.getFullYear() === chargeDate.getFullYear()
        );

        if (monthKey) {
          subscriptionCounts[monthKey.getTime()]['One-time Charges']++;
        }
      });
    });

    return Object.values(subscriptionCounts);
  };

  const processRevenueData = (customers: CustomerWithChargesAndSubscriptions[]) => {
    const lastSixMonths = getLastSixMonths();
    const revenueData = {} as any;

    lastSixMonths.forEach(date => {
      revenueData[date.getTime()] = {
        date: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        'New Subscriptions': 0,
        'Renewals': 0,
        'One-time Charges': 0,
      };
    });

    customers.forEach(customer => {
      customer.subscriptions.forEach(subscription => {
        const createdDate = new Date(subscription.createdAt);
        const monthKey = lastSixMonths.find(date =>
          date.getMonth() === createdDate.getMonth() &&
          date.getFullYear() === createdDate.getFullYear()
        );

        if (monthKey) {
          revenueData[monthKey.getTime()]['New Subscriptions'] += subscription.tier.price;
        }

        if (!subscription.cancelledAt) {
          let renewalDate = getRenewalMonth(subscription.createdAt, subscription.tier.cadence);

          while (renewalDate && renewalDate <= new Date()) {
            const renewalMonthKey = lastSixMonths.find(date =>
              date.getMonth() === renewalDate!.getMonth() &&
              date.getFullYear() === renewalDate!.getFullYear()
            );

            if (renewalMonthKey) {
              revenueData[renewalMonthKey.getTime()]['Renewals'] += subscription.tier.price;
            }
            renewalDate = getRenewalMonth(renewalDate, subscription.tier.cadence);
          }
        }
      });

      customer.charges.forEach(charge => {
        const chargeDate = new Date(charge.createdAt);
        const monthKey = lastSixMonths.find(date =>
          date.getMonth() === chargeDate.getMonth() &&
          date.getFullYear() === chargeDate.getFullYear()
        );

        if (monthKey) {
          revenueData[monthKey.getTime()]['One-time Charges'] += charge.tier.price;
        }
      });
    });

    return Object.values(revenueData);
  };

  const generateDummyData = () => {
    const lastSixMonths = getLastSixMonths();
    const dummyCustomerTotals = [];
    const dummyRevenueData = [];

    for (let i = 0; i < 6; i++) {
      const date = lastSixMonths[i].toLocaleString('default', { month: 'short', year: 'numeric' });

      dummyCustomerTotals.push({
        date,
        'New Subscriptions': Math.floor(Math.random() * 10) + 5,
        'Cancellations': Math.floor(Math.random() * 3),
        'Renewals': Math.floor(Math.random() * 8) + 3,
        'One-time Charges': Math.floor(Math.random() * 5) + 1,
      });

      dummyRevenueData.push({
        date,
        'New Subscriptions': Math.round((1000 + i * 200 + Math.random() * 300) / 10) * 10,
        'Renewals': Math.round((1500 + i * 250 + Math.random() * 400) / 10) * 10,
        'One-time Charges': Math.round((500 + i * 100 + Math.random() * 200) / 10) * 10,
      });
    }

    return { dummyCustomerTotals, dummyRevenueData };
  };

  const { dummyCustomerTotals, dummyRevenueData } = generateDummyData();
  const customerTotals = customers.length > 0 ? processCustomers(customers) : dummyCustomerTotals;
  const revenueData = customers.length > 0 ? processRevenueData(customers) : dummyRevenueData;

  const totalNewCustomers = customerTotals.reduce((acc, cur: any) => acc + cur['New Subscriptions'] + cur['One-time Charges'], 0) as number;
  const totalRevenue = revenueData.reduce((acc, cur: any) => acc + cur['New Subscriptions'] + cur['Renewals'] + cur['One-time Charges'], 0);

  const highestCustChangesInAMonth = Math.max(...customerTotals.map((total: any) => [total['New Subscriptions'], total['Cancellations'], total['Renewals'], total['One-time Charges']]).flat());
  const highestRevenueItemInMonth = Math.max(...revenueData.map((total: any) => [total['New Subscriptions'], total['Renewals'], total['One-time Charges']]).flat());

  const isUsingDummyData = customers.length === 0;


  return (
    <>
      <div className="mb-2 flex items-end justify-between">
        <div className="flex items-end gap-2">
          <div className="text-xl font-bold">Reports</div>
          {isUsingDummyData && (
            <Badge color={"gray"} size={"xs"} className="mb-1">
              Sample Data
            </Badge>
          )}
        </div>
        <Link href="/reports" className="ml-auto">
          <SecondaryButton label="More Details" />
        </Link>
      </div>
      <div className="flex max-w-screen-xl flex-col space-y-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-5">
              <CardTitle>
                <span className="mr-2">New Customers</span>
                <span className="text-sm font-normal text-stone-500">
                  Last 6 months
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Flex
                className="space-x-3 truncate"
                justifyContent="start"
                alignItems="baseline"
              >
                <Metric className="font-cal leading-none">
                  {totalNewCustomers}
                </Metric>
              </Flex>
              <BarChart
                className="mt-4 h-72"
                data={customerTotals}
                index="date"
                categories={[
                  "New Subscriptions",
                  "Cancellations",
                  "Renewals",
                  "One-time Charges",
                ]}
                colors={
                  isUsingDummyData
                    ? ["gray-300", "gray-400", "gray-500", "gray-600"]
                    : ["gray-400", "red-400", "green-400", "blue-400"]
                }
                autoMinValue={true}
                maxValue={Math.ceil((highestCustChangesInAMonth * 120) / 100)}
                intervalType="preserveStartEnd"
                allowDecimals={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-5">
              <CardTitle>
                <span className="mr-2">Revenue</span>
                <span className="text-sm font-normal text-stone-500">
                  Last 6 months
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Flex
                className="space-x-3 truncate"
                justifyContent="start"
                alignItems="baseline"
              >
                <Metric className="font-cal">${`${totalRevenue}`}</Metric>
              </Flex>

              <RevenueLineChart
                revenueData={revenueData}
                isUsingDummyData={isUsingDummyData}
                highestRevenueItemInMonth={highestRevenueItemInMonth}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}