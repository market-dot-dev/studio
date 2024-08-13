import { Metric, Card, Text, Flex, BarChart, LineChart, Button } from "@tremor/react";
import { CustomerWithChargesAndSubscriptions } from "@/app/app/(dashboard)/customers/customer-table";
import Link from "next/link";

export default function DashboardCharts({ customers }: { customers: CustomerWithChargesAndSubscriptions[] }) {

  const getRenewalMonth = (createdAt: Date, cadence: string) => {
    const creationDate = new Date(createdAt);
    let renewalDate;

    if (cadence === 'month') {
      renewalDate = new Date(creationDate.setMonth(creationDate.getMonth() + 1));
    } else if (cadence === 'year') {
      renewalDate = new Date(creationDate.setFullYear(creationDate.getFullYear() + 1));
    }

    return renewalDate?.getMonth();
  };

  const processCustomers = (customers: CustomerWithChargesAndSubscriptions[]) => {
    const currentYear = new Date().getFullYear();
    const subscriptionCounts = {} as any;
  
    for (let i = 0; i < 12; i++) {
      subscriptionCounts[i] = {
        date: new Date(currentYear, i).toLocaleString('default', { month: 'short', year: 'numeric' }),
        'New Subscriptions': 0,
        'Cancellations': 0,
        'Renewals': 0,
        'One-time Charges': 0,
      };
    }
  
    customers.forEach(customer => {
      customer.subscriptions.forEach(subscription => {
        const createdMonth = new Date(subscription.createdAt).getMonth();
        subscriptionCounts[createdMonth]['New Subscriptions']++;
  
        if (subscription.cancelledAt) {
          const cancelledMonth = new Date(subscription.cancelledAt).getMonth();
          subscriptionCounts[cancelledMonth]['Cancellations']++;
        }
  
        if (!subscription.cancelledAt) {
          let renewalMonth = getRenewalMonth(subscription.createdAt, subscription.tier.cadence);
  
          while (renewalMonth !== undefined && renewalMonth <= new Date().getMonth()) {
            subscriptionCounts[renewalMonth]['Renewals']++;
            const renewalDate = new Date(subscription.createdAt);
            renewalDate.setMonth(renewalMonth);
            renewalMonth = getRenewalMonth(renewalDate, subscription.tier.cadence);
          }
        }
      });
  
      customer.charges.forEach(charge => {
        const month = new Date(charge.createdAt).getMonth();
        subscriptionCounts[month]['One-time Charges']++;
      });
    });
  
    const processedData = Object.values(subscriptionCounts);
    return processedData;
  };
  

  const processRevenueData = (customers: CustomerWithChargesAndSubscriptions[]) => {
    const currentYear = new Date().getFullYear();
    const revenueData = Array.from({ length: 12 }, (_, i) => ({
      date: new Date(currentYear, i).toLocaleString('default', { month: 'short', year: 'numeric' }),
      'New Subscriptions': 0,
      'Renewals': 0,
      'One-time Charges': 0,
    }));
  
    customers.forEach(customer => {
      customer.subscriptions.forEach(subscription => {
        const monthIndex = new Date(subscription.createdAt).getMonth();
        const price = subscription.tier.price;
        revenueData[monthIndex]['New Subscriptions'] += price;
  
        if (!subscription.cancelledAt) {
          let renewalMonth = getRenewalMonth(subscription.createdAt, subscription.tier.cadence);
  
          while (renewalMonth !== undefined && renewalMonth <= new Date().getMonth()) {
            revenueData[renewalMonth]['Renewals'] += price;
            const renewalDate = new Date(subscription.createdAt);
            renewalDate.setMonth(renewalMonth);
            renewalMonth = getRenewalMonth(renewalDate, subscription.tier.cadence);
          }
        }
      });
  
      customer.charges.forEach(charge => {
        const monthIndex = new Date(charge.createdAt).getMonth();
        const price = charge.tier.price;
        revenueData[monthIndex]['One-time Charges'] += price;
      });
    });
  
    return revenueData;
  };
  

  const customerTotals = processCustomers(customers);
  const revenueData = processRevenueData(customers);

  const totalNewCustomers = customerTotals.reduce((acc, cur: any) => acc + cur['New Subscriptions'] + cur['One-time Charges'], 0) as number;
  const totalRevenue = revenueData.reduce((acc, cur) => acc + cur['New Subscriptions'] + cur['Renewals'] + cur['One-time Charges'], 0);

  return (
    <>
      <div className="flex max-w-screen-xl flex-col mt-4 space-y-4">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <div className="flex flex-row justify-between">
              <Text>Customers</Text>
            </div>
            <Flex
              className="space-x-3 truncate"
              justifyContent="start"
              alignItems="baseline"
            >
              <Metric className="font-cal">{totalNewCustomers}</Metric>
            </Flex>
            <BarChart
              className="h-72 mt-4"
              data={customerTotals}
              index="date"
              categories={["New Subscriptions", "Cancellations", "Renewals", "One-time Charges"]}
              colors={["gray-400", "red-400", "green-400", "blue-400"]}
              yAxisWidth={30}
            />
          </Card>

          <Card>
            <div className="flex flex-row justify-between">
              <Text>Revenue</Text>
            </div>
            <Flex
              className="space-x-3 truncate"
              justifyContent="start"
              alignItems="baseline"
            >
              <Metric className="font-cal">${totalRevenue}</Metric>
            </Flex>
            <LineChart
              className="h-72 mt-4"
              data={revenueData}
              index="date"
              categories={["New Subscriptions", "Renewals", "One-time Charges"]}
              colors={["gray-500", "blue-300", "yellow-300"]}
              yAxisWidth={80}
              connectNulls={true}
            />
          </Card>
        </div>
        <Link href='/reports' className="ml-auto">
          <Button size="xs" className="h-6" variant="secondary">
          More Details →
          </Button>
			</Link>
      </div>
    </>
  );
}
