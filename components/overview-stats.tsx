import { LineChart } from "@tremor/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CustomerWithChargesAndSubscriptions } from "@/app/app/(dashboard)/customers/customer-table";

const labels = {
  newSubscriptions: 'Subscriptions',
  cancellations: 'Cancellations',
  renewals: 'Renewals',
  oneTimeCharges: 'Charges',
  activeSubscriptions: 'Subscriptions',
  newSubscriptionsRevenue: 'Revenue',
  renewedSubscriptionsRevenue: 'Revenue',
  oneTimeChargesRevenue: 'Revenue',
  monthlyRecurringRevenue: 'Revenue',
  orders: 'Orders',
  averageOrderValue: 'Average Order Value',
} as any;

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

  const getRenewalDate = (createdAt: Date, cadence: string) => {
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
    const data = {
      newSubscriptions: [] as any[],
      cancellations: [] as any[],
      renewals: [] as any[],
      oneTimeCharges: [] as any[],
      activeSubscriptions: [] as any[],
      newSubscriptionsRevenue: [] as any[],
      renewedSubscriptionsRevenue: [] as any[],
      oneTimeChargesRevenue: [] as any[],
      monthlyRecurringRevenue: [] as any[],
      orders: [] as any[],
      averageOrderValue: [] as any[],
    } as any;
  
    lastSixMonths.forEach(date => {
      const monthLabel = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      Object.keys(data).forEach(key => {
        data[key].push({ date: monthLabel, [labels[key]]: 0 });
      });
    });
  
    customers.forEach(customer => {
      customer.subscriptions.forEach(subscription => {
        const createdDate = new Date(subscription.createdAt);
        const price = subscription.tier.price;
  
        const createdMonthIndex = lastSixMonths.findIndex(date => 
          date.getMonth() === createdDate.getMonth() && 
          date.getFullYear() === createdDate.getFullYear()
        );
  
        if (createdMonthIndex !== -1) {
          data.newSubscriptions[createdMonthIndex][labels['newSubscriptions']]++;
          data.newSubscriptionsRevenue[createdMonthIndex][labels['newSubscriptionsRevenue']] += price;
          data.activeSubscriptions[createdMonthIndex][labels['activeSubscriptions']]++;
        }
  
        if (subscription.cancelledAt) {
          const cancelledDate = new Date(subscription.cancelledAt);
          const cancelledMonthIndex = lastSixMonths.findIndex(date => 
            date.getMonth() === cancelledDate.getMonth() && 
            date.getFullYear() === cancelledDate.getFullYear()
          );
          
          if (cancelledMonthIndex !== -1) {
            data.cancellations[cancelledMonthIndex][labels['cancellations']]++;
          }
        } else {
          let renewalDate = getRenewalDate(subscription.createdAt, subscription.tier.cadence);
          
          while (renewalDate && renewalDate <= new Date()) {
            const renewalMonthIndex = lastSixMonths.findIndex(date => 
              date.getMonth() === renewalDate!.getMonth() && 
              date.getFullYear() === renewalDate!.getFullYear()
            );
            
            if (renewalMonthIndex !== -1) {
              data.renewals[renewalMonthIndex][labels['renewals']]++;
              data.renewedSubscriptionsRevenue[renewalMonthIndex][labels['renewedSubscriptionsRevenue']] += price;
              data.monthlyRecurringRevenue[renewalMonthIndex][labels['monthlyRecurringRevenue']] += price;
            }
            renewalDate = getRenewalDate(renewalDate, subscription.tier.cadence);
          }
        }
      });
  
      customer.charges.forEach(charge => {
        const chargeDate = new Date(charge.createdAt);
        const price = charge.tier.price;
  
        const chargeMonthIndex = lastSixMonths.findIndex(date => 
          date.getMonth() === chargeDate.getMonth() && 
          date.getFullYear() === chargeDate.getFullYear()
        );
  
        if (chargeMonthIndex !== -1) {
          data.oneTimeCharges[chargeMonthIndex][labels['oneTimeCharges']]++;
          data.oneTimeChargesRevenue[chargeMonthIndex][labels['oneTimeChargesRevenue']] += price;
          data.orders[chargeMonthIndex][labels['orders']]++;
  
          // Calculate average order value for the specific month
          if (data.orders[chargeMonthIndex][labels['orders']] > 0) {
            data.averageOrderValue[chargeMonthIndex][labels['averageOrderValue']] =
              data.oneTimeChargesRevenue[chargeMonthIndex][labels['oneTimeChargesRevenue']] /
              data.orders[chargeMonthIndex][labels['orders']];
          }
        }
      });
    });
  
    return data;
  };
  
  const data = processCustomers(customers);

  const renderChart = (title: string, data: any[], category: string, color: string) => {
    
    const heighestValue = Math.max(...data.map(d => d[labels[category]]));
    
    return (
      <Card>
        <CardHeader className="pb-5">
          <CardTitle>
            <span className="mr-2">{title}</span>
            <span className="text-sm font-normal text-stone-500">
              Last 6 months
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            className="h-72 mt-4"
            data={data}
            index="date"
            categories={[labels[category]]}
            colors={[color]}
            connectNulls={true}
            autoMinValue={true}
            maxValue={Math.ceil(heighestValue * 120 / 100)}
            intervalType="preserveStartEnd"
            allowDecimals={false}
          />
        </CardContent>
      </Card>
    )
  };

  return (
    <>
      <div className="flex max-w-screen-xl flex-col mt-4 space-y-4">
        <div className="grid gap-6 sm:grid-cols-2">
          {renderChart('New Subscriptions', data.newSubscriptions, 'newSubscriptions', 'gray-500')}
          {renderChart('New Subscriptions Revenue', data.newSubscriptionsRevenue, 'newSubscriptionsRevenue', 'blue-500')}
          {renderChart('Renewed Subscriptions', data.renewals, 'renewals', 'green-500')}
          {renderChart('Renewed Subscriptions Revenue', data.renewedSubscriptionsRevenue, 'renewedSubscriptionsRevenue', 'yellow-500')}
          {renderChart('Active Subscriptions', data.activeSubscriptions, 'activeSubscriptions', 'purple-500')}
          {renderChart('Monthly Recurring Revenue', data.monthlyRecurringRevenue, 'monthlyRecurringRevenue', 'red-500')}
          {renderChart('One-time Charges', data.oneTimeCharges, 'oneTimeCharges', 'orange-500')}
          {renderChart('One-time Charges Revenue', data.oneTimeChargesRevenue, 'oneTimeChargesRevenue', 'cyan-500')}
          {renderChart('Orders', data.orders, 'orders', 'green-500')}
          {renderChart('Average Order Value', data.averageOrderValue, 'averageOrderValue', 'teal-500')}
          {renderChart('Cancellations', data.cancellations, 'cancellations', 'pink-500')}
        </div>
      </div>
    </>
  );
}